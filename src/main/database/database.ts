import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { IpcMain } from 'electron'

const dbDir = path.join(app.getPath('userData'), 'Database')

/**
 * Predefined database file paths
 */
const matchsFile = path.join(dbDir, 'matchs.json')
const teamsFile = path.join(dbDir, 'teams.json')
const playersFile = path.join(dbDir, 'players.json')
const settingsFile = path.join(dbDir, 'settings.json')
const additionalFile = path.join(dbDir, 'additional.json')

// Ensure the database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

/**
 * Base entity type for collection storage (matchs/players/teams)
 */
export type EntityId = string | number
export interface BaseEntity {
  id: EntityId
  [key: string]: any
}

/**
 * Types for settings and additional (key-value storage)
 */
export type KeyValueData = Record<string, any>

/**
 * Collection storage data structure
 */
interface CollectionData<T extends BaseEntity> {
  items: T[]
}

/**
 * Key-value storage data structure
 */
type KVData<T extends KeyValueData> = T

/**
 * Simple write queue to ensure operation ordering under concurrency
 */
class AsyncQueue {
  private last: Promise<void> = Promise.resolve()
  enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.last.then(() => fn())
    this.last = run.then(
      () => undefined,
      () => undefined
    )
    return run
  }
}

/**
 * Collection store wrapper (matchs/players/teams)
 */
export class CollectionStore<T extends BaseEntity> {
  private db: Low<CollectionData<T>>
  private queue = new AsyncQueue()

  constructor(filePath: string) {
    // Low v7 requires passing defaultData
    this.db = new Low<CollectionData<T>>(new JSONFile<CollectionData<T>>(filePath), { items: [] })
    // If the storage file does not exist, write the default structure to create it
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify({ items: [] }, null, 2), 'utf-8')
      } catch (e) {
        console.error('Failed to create collection store file:', filePath, e)
      }
    }
  }

  private async ensureDefaults() {
    // Read file; if no data, Low keeps the default data provided at construction
    await this.db.read()
  }

  async getAll(): Promise<T[]> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      return this.db.data!.items
    })
  }

  async getById(id: EntityId): Promise<T | undefined> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      // Use loose equality to match string vs number IDs
      return this.db.data!.items.find((x) => x.id == id)
    })
  }

  async add(item: T): Promise<T> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      const exists = this.db.data!.items.some((x) => x.id === item.id)
      if (exists) throw new Error(`Item with id ${String(item.id)} already exists`)
      this.db.data!.items.push(item)
      await this.db.write()
      return item
    })
  }

  async remove(id: EntityId): Promise<boolean> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      const before = this.db.data!.items.length
      this.db.data!.items = this.db.data!.items.filter((x) => x.id !== id)
      const changed = this.db.data!.items.length !== before
      if (changed) await this.db.write()
      return changed
    })
  }

  async modify(id: EntityId, partial: Partial<T>): Promise<T | undefined> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      const idx = this.db.data!.items.findIndex((x) => x.id === id)
      if (idx === -1) return undefined
      const updated = { ...this.db.data!.items[idx], ...partial, id } as T
      this.db.data!.items[idx] = updated
      await this.db.write()
      return updated
    })
  }

  /** Replace the entire collection */
  async set(items: T[]): Promise<T[]> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      this.db.data!.items = items
      await this.db.write()
      return items
    })
  }
}

/**
 * Key-value store wrapper (settings/additional)
 */
export class KeyValueStore<T extends KeyValueData> {
  private db: Low<KVData<T>>
  private queue = new AsyncQueue()

  constructor(
    filePath: string,
    private defaults: T
  ) {
    // Low v7 requires passing defaultData
    this.db = new Low<KVData<T>>(new JSONFile<KVData<T>>(filePath), this.defaults)
    // If the storage file does not exist, write the default object to create it
    if (!fs.existsSync(filePath)) {
      try {
        const initial = this.defaults ?? ({} as T)
        fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf-8')
      } catch (e) {
        console.error('Failed to create key-value store file:', filePath, e)
      }
    }
  }

  private async ensureDefaults() {
    // Read file; if no data, Low keeps the default data provided at construction
    await this.db.read()
  }

  async getAll(): Promise<T> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      return this.db.data as T
    })
  }

  async get<K extends keyof T>(key: K): Promise<T[K]> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      return (this.db.data as T)[key]
    })
  }

  async add<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      if ((this.db.data as T)[key] !== undefined) {
        throw new Error(`Key ${String(key)} already exists`)
      }
      ; (this.db.data as T)[key] = value
      await this.db.write()
    })
  }

  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
        ; (this.db.data as T)[key] = value
      await this.db.write()
    })
  }

  async modify<K extends keyof T>(key: K, partial: Partial<T[K]>): Promise<T[K]> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      const current = (this.db.data as T)[key]
      const updated =
        typeof current === 'object' && current !== null
          ? ({ ...current, ...partial } as T[K])
          : (partial as T[K])
        ; (this.db.data as T)[key] = updated
      await this.db.write()
      return updated
    })
  }

  async remove<K extends keyof T>(key: K): Promise<boolean> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      const exists = (this.db.data as T)[key] !== undefined
      if (exists) {
        delete (this.db.data as T)[key]
        await this.db.write()
      }
      return exists
    })
  }

  /** Replace the entire object */
  async setAll(next: T): Promise<T> {
    return this.queue.enqueue(async () => {
      await this.ensureDefaults()
      this.db.data = { ...next } as T
      await this.db.write()
      return this.db.data as T
    })
  }
}

/**
 * Top-level database service; manages all stores
 */
export class DatabaseService {
  readonly matchs = new KeyValueStore<Record<string, BaseEntity>>(matchsFile, {})
  readonly teams = new CollectionStore<BaseEntity>(teamsFile)
  readonly players = new CollectionStore<BaseEntity>(playersFile)
  readonly settings = new KeyValueStore<KeyValueData>(settingsFile, {
    "seriesName_first": "BLAST Rival #1",
    "seriesName_second": "Grand Final",
    "seriesName_third": "VoidHUD",
    "overlayFocusedPlayer": true,
    "overlaySidebars": "row",
    "overlayTopbar": true,
    "overlayRadar": true,
    "ctColor": "286efa",
    "tColor": "f52559",
    "borderRadius": "0px",
    "currentMatchId": "current",
    "shortcutKey": "Ctrl+Alt+I"
  })
  readonly additional = new KeyValueStore<KeyValueData>(additionalFile, {})
}

export const databaseService = new DatabaseService()

/**
 * Register IPC handler to allow renderer processes to invoke the database
 *
 * Unified channel: 'db:invoke'
 * Parameter contract:
 * - target: 'matchs' | 'players' | 'teams' | 'settings' | 'additional'
 * - action: Collection: 'add' | 'remove' | 'modify' | 'set' | 'getAll' | 'getById'
 *           KeyValue:   'add' | 'remove' | 'modify' | 'set' | 'setAll' | 'get' | 'getAll'
 * - payload: parameters required by the corresponding method
 */
export function registerDatabaseIPC(ipc: IpcMain) {
  ipc.handle('db:invoke', async (_event, args) => {
    const { target, action, payload } = args as {
      target: keyof DatabaseService
      action: string
      payload: any
    }

    const svc = databaseService[target]
    if (!svc || typeof svc !== 'object') throw new Error(`Unknown target: ${String(target)}`)

    // Collection store
    if (svc instanceof CollectionStore) {
      switch (action) {
        case 'getAll':
          return svc.getAll()
        case 'getById':
          return svc.getById(payload.id)
        case 'add':
          return svc.add(payload.item)
        case 'remove':
          return svc.remove(payload.id)
        case 'modify':
          return svc.modify(payload.id, payload.partial)
        case 'set':
          return svc.set(payload.items)
        default:
          throw new Error(`Unknown action for collection: ${action}`)
      }
    }

    // Key-value store
    if (svc instanceof KeyValueStore) {
      switch (action) {
        case 'getAll':
          return svc.getAll()
        case 'get':
          return svc.get(payload.key)
        case 'add':
          return svc.add(payload.key, payload.value)
        case 'set':
          return svc.set(payload.key, payload.value)
        case 'modify':
          return svc.modify(payload.key, payload.partial)
        case 'remove':
          return svc.remove(payload.key)
        case 'setAll':
          return svc.setAll(payload.data)
        default:
          throw new Error(`Unknown action for keyvalue: ${action}`)
      }
    }

    throw new Error('Invalid database service instance')
  })
}

/**
 * Direct import usage is also supported:
 * import { databaseService } from './database'
 * await databaseService.matchs.add({...})
 */
