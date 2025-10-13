import { app, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Define a safe JSON value type to avoid using `object`
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

type AnyRecord = Record<string, JSONValue>

export type PlayersData = { players: AnyRecord[] }
export type TeamsData = { teams: AnyRecord[] }
export type MatchesData = { matches: AnyRecord[] }
export type SettingsData = { settings: AnyRecord }
export type OthersData = { others: AnyRecord }

export type CollectionName = 'players' | 'teams' | 'matchs' | 'settings' | 'others'

type CollectionInnerMap = {
  players: PlayersData['players']
  teams: TeamsData['teams']
  matchs: MatchesData['matches']
  settings: SettingsData['settings']
  others: OthersData['others']
}

const appPath = join(app.getPath('userData'), 'Database')
// Ensure the Database directory exists under userData
if (!existsSync(appPath)) {
  mkdirSync(appPath, { recursive: true })
}

class Database {
  private static instance: Database

  private playersDB: Low<PlayersData>
  private teamsDB: Low<TeamsData>
  private matchesDB: Low<MatchesData>
  private settingsDB: Low<SettingsData>
  private othersDB: Low<OthersData>

  private constructor() {
    const playersAdapter = new JSONFile<PlayersData>(join(appPath, 'players.json'))
    const teamsAdapter = new JSONFile<TeamsData>(join(appPath, 'teams.json'))
    const matchesAdapter = new JSONFile<MatchesData>(join(appPath, 'matchs.json'))
    const settingsAdapter = new JSONFile<SettingsData>(join(appPath, 'settings.json'))
    const othersAdapter = new JSONFile<OthersData>(join(appPath, 'others.json'))

    this.playersDB = new Low(playersAdapter, { players: [] })
    this.teamsDB = new Low(teamsAdapter, { teams: [] })
    this.matchesDB = new Low(matchesAdapter, { matches: [] })
    this.settingsDB = new Low(settingsAdapter, { settings: {} })
    this.othersDB = new Low(othersAdapter, { others: {} })
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  public async init(): Promise<void> {
    await this.ensureDefaults()
  }

  private async ensureDefaults(): Promise<void> {
    await Promise.all([
      this.playersDB.read(),
      this.teamsDB.read(),
      this.matchesDB.read(),
      this.settingsDB.read(),
      this.othersDB.read()
    ])

    if (!this.playersDB.data) {
      this.playersDB.data = { players: [] }
      await this.playersDB.write()
    }
    if (!this.teamsDB.data) {
      this.teamsDB.data = { teams: [] }
      await this.teamsDB.write()
    }
    if (!this.matchesDB.data) {
      this.matchesDB.data = { matches: [] }
      await this.matchesDB.write()
    }
    if (!this.settingsDB.data) {
      this.settingsDB.data = { settings: {} }
      await this.settingsDB.write()
    }
    if (!this.othersDB.data) {
      this.othersDB.data = { others: {} }
      await this.othersDB.write()
    }
  }

  public async get<T extends CollectionName>(collection: T): Promise<CollectionInnerMap[T]> {
    await this.ensureDefaults()
    switch (collection) {
      case 'players':
        return this.playersDB.data!.players as CollectionInnerMap[T]
      case 'teams':
        return this.teamsDB.data!.teams as CollectionInnerMap[T]
      case 'matchs':
        return this.matchesDB.data!.matches as CollectionInnerMap[T]
      case 'settings':
        return this.settingsDB.data!.settings as CollectionInnerMap[T]
      case 'others':
        return this.othersDB.data!.others as CollectionInnerMap[T]
      default:
        throw new Error(`Unknown collection: ${collection}`)
    }
  }

  public async set<T extends CollectionName>(
    collection: T,
    value: CollectionInnerMap[T]
  ): Promise<void> {
    await this.ensureDefaults()
    switch (collection) {
      case 'players':
        this.playersDB.data!.players = value as PlayersData['players']
        await this.playersDB.write()
        break
      case 'teams':
        this.teamsDB.data!.teams = value as TeamsData['teams']
        await this.teamsDB.write()
        break
      case 'matchs':
        this.matchesDB.data!.matches = value as MatchesData['matches']
        await this.matchesDB.write()
        break
      case 'settings':
        this.settingsDB.data!.settings = value as SettingsData['settings']
        await this.settingsDB.write()
        break
      case 'others':
        this.othersDB.data!.others = value as OthersData['others']
        await this.othersDB.write()
        break
      default:
        throw new Error(`Unknown collection: ${collection}`)
    }
  }

  // Add helper: append to array collections, merge into object collections
  public async add(collection: 'players', item: AnyRecord): Promise<void>
  public async add(collection: 'teams', item: AnyRecord): Promise<void>
  public async add(collection: 'matchs', item: AnyRecord): Promise<void>
  public async add(collection: 'settings', item: AnyRecord): Promise<void>
  public async add(collection: 'others', item: AnyRecord): Promise<void>
  // Accept union type to support calls with variable `CollectionName`
  public async add(collection: CollectionName, item: AnyRecord): Promise<void>
  public async add(collection: CollectionName, item: AnyRecord): Promise<void> {
    await this.ensureDefaults()
    switch (collection) {
      case 'players':
        this.playersDB.data!.players.push(item)
        await this.playersDB.write()
        break
      case 'teams':
        this.teamsDB.data!.teams.push(item)
        await this.teamsDB.write()
        break
      case 'matchs':
        this.matchesDB.data!.matches.push(item)
        await this.matchesDB.write()
        break
      case 'settings':
        this.settingsDB.data!.settings = {
          ...this.settingsDB.data!.settings,
          ...item
        }
        await this.settingsDB.write()
        break
      case 'others':
        this.othersDB.data!.others = {
          ...this.othersDB.data!.others,
          ...item
        }
        await this.othersDB.write()
        break
      default:
        throw new Error(`Unknown collection: ${collection}`)
    }
  }

  // Modify helper: update existing items
  // Array collections: find by `id` and merge patch; returns whether modified
  public async modify(collection: 'players', id: string, patch: AnyRecord): Promise<boolean>
  public async modify(collection: 'teams', id: string, patch: AnyRecord): Promise<boolean>
  public async modify(collection: 'matchs', id: string, patch: AnyRecord): Promise<boolean>
  // Object collections: merge provided patch into the object
  public async modify(collection: 'settings', patch: AnyRecord): Promise<void>
  public async modify(collection: 'others', patch: AnyRecord): Promise<void>
  // Accept union type to support calls with variable `CollectionName`
  public async modify(
    collection: CollectionName,
    arg1: string | AnyRecord,
    arg2?: AnyRecord
  ): Promise<boolean | void>
  public async modify(
    collection: CollectionName,
    arg1: string | AnyRecord,
    arg2?: AnyRecord
  ): Promise<boolean | void> {
    await this.ensureDefaults()
    switch (collection) {
      case 'players': {
        const id = arg1 as string
        const patch = (arg2 ?? {}) as AnyRecord
        const idx = this.playersDB.data!.players.findIndex((p: AnyRecord) => p.id === id)
        if (idx >= 0) {
          this.playersDB.data!.players[idx] = {
            ...this.playersDB.data!.players[idx],
            ...patch
          }
          await this.playersDB.write()
          return true
        }
        return false
      }
      case 'teams': {
        const id = arg1 as string
        const patch = (arg2 ?? {}) as AnyRecord
        const idx = this.teamsDB.data!.teams.findIndex((t: AnyRecord) => t.id === id)
        if (idx >= 0) {
          this.teamsDB.data!.teams[idx] = {
            ...this.teamsDB.data!.teams[idx],
            ...patch
          }
          await this.teamsDB.write()
          return true
        }
        return false
      }
      case 'matchs': {
        const id = arg1 as string
        const patch = (arg2 ?? {}) as AnyRecord
        const idx = this.matchesDB.data!.matches.findIndex((m: AnyRecord) => m.id === id)
        if (idx >= 0) {
          this.matchesDB.data!.matches[idx] = {
            ...this.matchesDB.data!.matches[idx],
            ...patch
          }
          await this.matchesDB.write()
          return true
        }
        return false
      }
      case 'settings': {
        const patch = arg1 as AnyRecord
        this.settingsDB.data!.settings = {
          ...this.settingsDB.data!.settings,
          ...patch
        }
        await this.settingsDB.write()
        return
      }
      case 'others': {
        const patch = arg1 as AnyRecord
        this.othersDB.data!.others = {
          ...this.othersDB.data!.others,
          ...patch
        }
        await this.othersDB.write()
        return
      }
      default:
        throw new Error(`Unknown collection: ${collection}`)
    }
  }

  // Delete helper
  // Array collections: remove by `id`; returns whether deleted
  public async delete(collection: 'players', id: string): Promise<boolean>
  public async delete(collection: 'teams', id: string): Promise<boolean>
  public async delete(collection: 'matchs', id: string): Promise<boolean>
  // Object collections: delete a key from the object
  public async delete(collection: 'settings', key: string): Promise<void>
  public async delete(collection: 'others', key: string): Promise<void>
  public async delete(collection: CollectionName, arg1: string): Promise<boolean | void>
  public async delete(collection: CollectionName, arg1: string): Promise<boolean | void> {
    await this.ensureDefaults()
    switch (collection) {
      case 'players': {
        const id = arg1
        const idx = this.playersDB.data!.players.findIndex((p: AnyRecord) => p.id === id)
        if (idx >= 0) {
          this.playersDB.data!.players.splice(idx, 1)
          await this.playersDB.write()
          return true
        }
        return false
      }
      case 'teams': {
        const id = arg1
        const idx = this.teamsDB.data!.teams.findIndex((t: AnyRecord) => t.id === id)
        if (idx >= 0) {
          this.teamsDB.data!.teams.splice(idx, 1)
          await this.teamsDB.write()
          return true
        }
        return false
      }
      case 'matchs': {
        const id = arg1
        const idx = this.matchesDB.data!.matches.findIndex((m: AnyRecord) => m.id === id)
        if (idx >= 0) {
          this.matchesDB.data!.matches.splice(idx, 1)
          await this.matchesDB.write()
          return true
        }
        return false
      }
      case 'settings': {
        const key = arg1
        if (key in this.settingsDB.data!.settings) {
          delete this.settingsDB.data!.settings[key]
          await this.settingsDB.write()
        }
        return
      }
      case 'others': {
        const key = arg1
        if (key in this.othersDB.data!.others) {
          delete this.othersDB.data!.others[key]
          await this.othersDB.write()
        }
        return
      }
      default:
        throw new Error(`Unknown collection: ${collection}`)
    }
  }
}

export const database = Database.getInstance()
// Ensure JSON files are created on startup
void database.init()

export function setupDatabaseIPC(): void {
  ipcMain.handle('db:get', async (_, collection: CollectionName) => {
    return database.get(collection)
  })

  ipcMain.handle(
    'db:set',
    async (_, collection: CollectionName, value: CollectionInnerMap[CollectionName]) => {
      // We accept value as a union type; runtime validation can be added if needed
      await database.set(collection as CollectionName, value as any)
    }
  )

  ipcMain.handle('db:add', async (_, collection: CollectionName, item: AnyRecord) => {
    await database.add(collection, item)
  })

  ipcMain.handle(
    'db:modify',
    async (_, collection: CollectionName, arg1: string | AnyRecord, arg2?: AnyRecord) => {
      return database.modify(collection as CollectionName, arg1 as any, arg2 as any)
    }
  )

  ipcMain.handle('db:delete', async (_, collection: CollectionName, arg1: string) => {
    return database.delete(collection as CollectionName, arg1 as any)
  })
}

// Initialize IPC immediately when this module is loaded
setupDatabaseIPC()
