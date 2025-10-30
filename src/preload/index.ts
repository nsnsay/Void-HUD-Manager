import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
  openOverlay: () => ipcRenderer.send('openWindow'),
  closeOverlay: () => ipcRenderer.send('closeWindow'),
  openWindow: () => ipcRenderer.send('openWindow'),
  closeWindow: () => ipcRenderer.send('closeWindow'),
  getOverlayStatus: () => ipcRenderer.invoke('getOverlayStatus'),
  autoPlaceGSI: () => ipcRenderer.invoke('gsi:auto-place')
}

// Updater APIs for renderer
const update = {
  check: () => ipcRenderer.invoke('updater:check'),
  download: () => ipcRenderer.invoke('updater:download'),
  quitAndInstall: () => ipcRenderer.invoke('updater:quitAndInstall'),
  on: (cb: (payload: any) => void) => ipcRenderer.on('updater:status', (_evt, payload) => cb(payload))
}

// Database IPC wrappers with typed-like structure
const db = {
  matchs: {
    // KeyValue store semantics in main process
    getAll: () => ipcRenderer.invoke('db:invoke', { target: 'matchs', action: 'getAll' }),
    getById: (id: string | number) =>
      ipcRenderer.invoke('db:invoke', { target: 'matchs', action: 'get', payload: { key: String(id) } }),
    add: (item: { id: string | number; [key: string]: any }) =>
      ipcRenderer.invoke('db:invoke', {
        target: 'matchs',
        action: 'add',
        payload: { key: String(item.id), value: item }
      }),
    remove: (id: string | number) =>
      ipcRenderer.invoke('db:invoke', { target: 'matchs', action: 'remove', payload: { key: String(id) } }),
    modify: (id: string | number, partial: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', {
        target: 'matchs',
        action: 'modify',
        payload: { key: String(id), partial }
      }),
    set: (items: Array<{ id: string | number; [key: string]: any }>) =>
      ipcRenderer.invoke('db:invoke', {
        target: 'matchs',
        action: 'setAll',
        payload: { data: Object.fromEntries(items.map((it) => [String(it.id), it])) }
      })
  },
  players: {
    getAll: () => ipcRenderer.invoke('db:invoke', { target: 'players', action: 'getAll' }),
    getById: (id: string | number) =>
      ipcRenderer.invoke('db:invoke', { target: 'players', action: 'getById', payload: { id } }),
    add: (item: { id: string | number; [key: string]: any }) =>
      ipcRenderer.invoke('db:invoke', { target: 'players', action: 'add', payload: { item } }),
    remove: (id: string | number) =>
      ipcRenderer.invoke('db:invoke', { target: 'players', action: 'remove', payload: { id } }),
    modify: (id: string | number, partial: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', {
        target: 'players',
        action: 'modify',
        payload: { id, partial }
      }),
    set: (items: Array<{ id: string | number; [key: string]: any }>) =>
      ipcRenderer.invoke('db:invoke', { target: 'players', action: 'set', payload: { items } })
  },
  teams: {
    getAll: () => ipcRenderer.invoke('db:invoke', { target: 'teams', action: 'getAll' }),
    getById: (id: string | number) =>
      ipcRenderer.invoke('db:invoke', { target: 'teams', action: 'getById', payload: { id } }),
    add: (item: { id: string | number; [key: string]: any }) =>
      ipcRenderer.invoke('db:invoke', { target: 'teams', action: 'add', payload: { item } }),
    remove: (id: string | number) =>
      ipcRenderer.invoke('db:invoke', { target: 'teams', action: 'remove', payload: { id } }),
    modify: (id: string | number, partial: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', { target: 'teams', action: 'modify', payload: { id, partial } }),
    set: (items: Array<{ id: string | number; [key: string]: any }>) =>
      ipcRenderer.invoke('db:invoke', { target: 'teams', action: 'set', payload: { items } })
  },
  settings: {
    getAll: () => ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'getAll' }),
    get: (key: string) => ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'get', payload: { key } }),
    add: (key: string, value: any) =>
      ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'add', payload: { key, value } }),
    set: (key: string, value: any) =>
      ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'set', payload: { key, value } }),
    modify: (key: string, partial: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'modify', payload: { key, partial } }),
    remove: (key: string) =>
      ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'remove', payload: { key } }),
    setAll: (data: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', { target: 'settings', action: 'setAll', payload: { data } })
  },
  additional: {
    getAll: () => ipcRenderer.invoke('db:invoke', { target: 'additional', action: 'getAll' }),
    get: (key: string) => ipcRenderer.invoke('db:invoke', { target: 'additional', action: 'get', payload: { key } }),
    add: (key: string, value: any) =>
      ipcRenderer.invoke('db:invoke', { target: 'additional', action: 'add', payload: { key, value } }),
    set: (key: string, value: any) =>
      ipcRenderer.invoke('db:invoke', { target: 'additional', action: 'set', payload: { key, value } }),
    modify: (key: string, partial: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', {
        target: 'additional',
        action: 'modify',
        payload: { key, partial }
      }),
    remove: (key: string) =>
      ipcRenderer.invoke('db:invoke', { target: 'additional', action: 'remove', payload: { key } }),
    setAll: (data: Record<string, any>) =>
      ipcRenderer.invoke('db:invoke', { target: 'additional', action: 'setAll', payload: { data } })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('db', db)
    contextBridge.exposeInMainWorld('update', update)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.db = db
  // @ts-ignore (define in dts)
  window.update = update
}
