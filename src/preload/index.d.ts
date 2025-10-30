import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      minimize: () => void
      close: () => void
      openOverlay: () => void
      closeOverlay: () => void
      openWindow: () => void
      closeWindow: () => void
      getOverlayStatus: () => Promise<{
        isOpen: boolean
        isVisible: boolean
        isFocused: boolean
        isFullScreen: boolean
        url: string
        id: number | null
      }>
      autoPlaceGSI: () => Promise<{ success: boolean; message: string; targetPath?: string }>
    }
    db: {
      matchs: {
        getAll: () => Promise<Array<{ id: string | number; [key: string]: any }>>
        getById: (id: string | number) => Promise<{ id: string | number; [key: string]: any } | undefined>
        add: (item: { id: string | number; [key: string]: any }) => Promise<{ id: string | number; [key: string]: any }>
        remove: (id: string | number) => Promise<boolean>
        modify: (id: string | number, partial: Record<string, any>) => Promise<{ id: string | number; [key: string]: any } | undefined>
        set: (items: Array<{ id: string | number; [key: string]: any }>) => Promise<Array<{ id: string | number; [key: string]: any }>>
      }
      players: {
        getAll: () => Promise<Array<{ id: string | number; [key: string]: any }>>
        getById: (id: string | number) => Promise<{ id: string | number; [key: string]: any } | undefined>
        add: (item: { id: string | number; [key: string]: any }) => Promise<{ id: string | number; [key: string]: any }>
        remove: (id: string | number) => Promise<boolean>
        modify: (id: string | number, partial: Record<string, any>) => Promise<{ id: string | number; [key: string]: any } | undefined>
        set: (items: Array<{ id: string | number; [key: string]: any }>) => Promise<Array<{ id: string | number; [key: string]: any }>>
      }
      teams: {
        getAll: () => Promise<Array<{ id: string | number; [key: string]: any }>>
        getById: (id: string | number) => Promise<{ id: string | number; [key: string]: any } | undefined>
        add: (item: { id: string | number; [key: string]: any }) => Promise<{ id: string | number; [key: string]: any }>
        remove: (id: string | number) => Promise<boolean>
        modify: (id: string | number, partial: Record<string, any>) => Promise<{ id: string | number; [key: string]: any } | undefined>
        set: (items: Array<{ id: string | number; [key: string]: any }>) => Promise<Array<{ id: string | number; [key: string]: any }>>
      }
      settings: {
        getAll: () => Promise<Record<string, any>>
        get: (key: string) => Promise<any>
        add: (key: string, value: any) => Promise<void>
        set: (key: string, value: any) => Promise<void>
        modify: (key: string, partial: Record<string, any>) => Promise<any>
        remove: (key: string) => Promise<boolean>
        setAll: (data: Record<string, any>) => Promise<Record<string, any>>
      }
      additional: {
        getAll: () => Promise<Record<string, any>>
        get: (key: string) => Promise<any>
        add: (key: string, value: any) => Promise<void>
        set: (key: string, value: any) => Promise<void>
        modify: (key: string, partial: Record<string, any>) => Promise<any>
        remove: (key: string) => Promise<boolean>
        setAll: (data: Record<string, any>) => Promise<Record<string, any>>
      }
    }
    update: {
      check: () => Promise<{ success: boolean; error?: string }>
      download: () => Promise<{ success: boolean; error?: string }>
      quitAndInstall: () => Promise<{ success: boolean; error?: string }>
      on: (cb: (payload: any) => void) => void
    }
  }
}
