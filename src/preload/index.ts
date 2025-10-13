import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { LogLevel } from '../main/logger/logger'

// Custom APIs for renderer
const api = {
  minimizeWindow: () => {
    ipcRenderer.send('minimize-window')
  },
  closeWindow: () => {
    ipcRenderer.send('close-window')
  },
  logger: {
    debug: (message: string, context?: string) => {
      ipcRenderer.invoke('logger:debug', message, context)
    },
    info: (message: string, context?: string) => {
      ipcRenderer.invoke('logger:info', message, context)
    },
    warn: (message: string, context?: string) => {
      ipcRenderer.invoke('logger:warn', message, context)
    },
    error: (message: string, context?: string) => {
      ipcRenderer.invoke('logger:error', message, context)
    },
    setLevel: (level: LogLevel) => {
      return ipcRenderer.invoke('logger:setLevel', level)
    },
    getLevel: () => {
      return ipcRenderer.invoke('logger:getLevel')
    }
  },
  database: {
    get: (collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others') => {
      return ipcRenderer.invoke('db:get', collection)
    },
    set: (
      collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others',
      value: unknown
    ) => {
      return ipcRenderer.invoke('db:set', collection, value)
    },
    add: (
      collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others',
      item: Record<string, unknown>
    ) => {
      return ipcRenderer.invoke('db:add', collection, item)
    },
    // modify: array collections accept (collection, id, patch); object collections accept (collection, patch)
    modify: (
      collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others',
      ...args: any[]
    ) => {
      return ipcRenderer.invoke('db:modify', collection, ...args)
    },
    delete: (
      collection: 'players' | 'teams' | 'matchs' | 'settings' | 'others',
      ...args: any[]
    ) => {
      return ipcRenderer.invoke('db:delete', collection, ...args)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
