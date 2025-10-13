import { ElectronAPI } from '@electron-toolkit/preload'
import { LogLevel } from '../main/logger/logger'

interface LoggerAPI {
  debug: (message: string, context?: string) => Promise<void>
  info: (message: string, context?: string) => Promise<void>
  warn: (message: string, context?: string) => Promise<void>
  error: (message: string, context?: string) => Promise<void>
  setLevel: (level: LogLevel) => Promise<void>
  getLevel: () => Promise<LogLevel>
}

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }

type CollectionName = 'players' | 'teams' | 'matchs' | 'settings' | 'others'

interface DatabaseAPI {
  get: (collection: CollectionName) => Promise<unknown>
  set: (collection: CollectionName, value: unknown) => Promise<void>
  add: (collection: CollectionName, item: Record<string, unknown>) => Promise<void>
  // Array collections: (collection, id, patch) -> Promise<boolean>
  modify: (
    collection: 'players' | 'teams' | 'matchs',
    id: string,
    patch: Record<string, unknown>
  ) => Promise<boolean>
  // Object collections: (collection, patch) -> Promise<void>
  modify: (
    collection: 'settings' | 'others',
    patch: Record<string, unknown>
  ) => Promise<void>
  // Delete helpers
  // Array collections: (collection, id) -> Promise<boolean>
  delete: (
    collection: 'players' | 'teams' | 'matchs',
    id: string
  ) => Promise<boolean>
  // Object collections: (collection, key) -> Promise<void>
  delete: (
    collection: 'settings' | 'others',
    key: string
  ) => Promise<void>
}

interface WindowAPI {
  minimizeWindow: () => void
  closeWindow: () => void
  logger: LoggerAPI
  database: DatabaseAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowAPI
  }
}
