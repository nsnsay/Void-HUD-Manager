/// <reference types="vite/client" />

interface Window {
  api: {
    minimizeWindow: () => void
    closeWindow: () => void
    logger: {
      debug: (message: string, context?: string) => void
      info: (message: string, context?: string) => void
      warn: (message: string, context?: string) => void
      error: (message: string, context?: string) => void
      setLevel: (level: LogLevel) => void
      getLevel: () => LogLevel
    },
    database: {
      get: (collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others') => Promise<unknown>
      set: (
        collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others',
        value: unknown
      ) => Promise<void>
      add: (
        collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others',
        item: Record<string, unknown>
      ) => Promise<void>
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
  }
  electron: any
}
