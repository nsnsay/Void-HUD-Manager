import { BrowserWindow, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'

let overlayWindow: BrowserWindow | null = null

function createOverlayWindow(): BrowserWindow {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.show()
    overlayWindow.focus()
    return overlayWindow
  }

  overlayWindow = new BrowserWindow({
    fullscreen: true,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    focusable: true,
    frame: false,
    title: 'Void HUD Overlay',
    // 透明层不被点击
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })

  // Keep overlay above fullscreen windows
  overlayWindow.setAlwaysOnTop(true, 'screen-saver')
  overlayWindow.setFullScreen(true)
  overlayWindow.setIgnoreMouseEvents(true)

  const url = is.dev ? 'http://localhost:5032/' : 'http://localhost:5031/overlay'
  console.log(is.dev)
  overlayWindow.loadURL(url).catch(() => {
    // ignore load errors here; renderer/logs will reflect if server is unavailable
  })

  return overlayWindow
}

ipcMain.on('openWindow', () => {
  createOverlayWindow()
})

ipcMain.on('closeWindow', () => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.close()
    overlayWindow = null
  }
})

ipcMain.handle('getOverlayStatus', async () => {
  const w = overlayWindow
  const isOpen = !!(w && !w.isDestroyed())
  return {
    isOpen,
    isVisible: isOpen ? w!.isVisible() : false,
    isFocused: isOpen ? w!.isFocused() : false,
    isFullScreen: isOpen ? w!.isFullScreen() : false,
    url: isOpen ? w!.webContents.getURL() : '',
    id: isOpen ? w!.id : null
  }
})
