import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import appIcon from './logo.png?asset'
import { registerDatabaseIPC, databaseService } from './database/database'
import './gsi/gsi'
import './overlay/overlay'
import { registerAutoPlaceGSIIPC } from './gsi/auto-place'
import { autoUpdater } from 'electron-updater'

let acrylicEnabledSetting = true

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1150,
    height: 750,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    fullscreenable: false,
    icon: appIcon,
    minWidth: 1150,
    minHeight: 750,
    maxWidth: 1500,
    maxHeight: 1200,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true
    }
  })

  if (process.platform === 'win32' && acrylicEnabledSetting) {
    const applyAcrylic = (): void => {
      try {
        mainWindow.setBackgroundMaterial('acrylic')
      } catch { }
    }
    applyAcrylic()
    mainWindow.on('blur', applyAcrylic)
    mainWindow.on('focus', applyAcrylic)
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })
  ipcMain.on('close', () => {
    BrowserWindow.getAllWindows().forEach((win) => win.close())
  })

  // 读取毛玻璃设置
  try {
    const enabled = await databaseService.settings.get('acrylicEnabled')
    acrylicEnabledSetting = enabled == null ? true : Boolean(enabled)
  } catch { }

  // 注册数据库 IPC
  registerDatabaseIPC(ipcMain)
  // 注册自动放置 GSI 的 IPC
  registerAutoPlaceGSIIPC(ipcMain)

  // 更新状态下发到渲染层
  const sendUpdate = (payload: unknown): void => {
    const win = BrowserWindow.getAllWindows()[0]
    win?.webContents.send('updater:status', payload)
  }

  // electron-updater 配置与事件
  autoUpdater.autoDownload = true

  autoUpdater.on('checking-for-update', () => sendUpdate({ type: 'checking' }))
  autoUpdater.on('update-available', (info) => sendUpdate({ type: 'available', info }))
  autoUpdater.on('update-not-available', (info) => sendUpdate({ type: 'notAvailable', info }))
  autoUpdater.on('error', (err) => sendUpdate({ type: 'error', error: String(err) }))
  autoUpdater.on('download-progress', (progress) => sendUpdate({ type: 'downloading', progress }))
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdate({ type: 'downloaded', info })
    autoUpdater.quitAndInstall()
  })

  // 渲染层控制更新流程
  ipcMain.handle('updater:check', async () => {
    try {
      await autoUpdater.checkForUpdates()
      return { success: true }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  })
  ipcMain.handle('updater:download', async () => {
    try {
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  })
  ipcMain.handle('updater:quitAndInstall', () => {
    try {
      autoUpdater.quitAndInstall()
      return { success: true }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  })

  // 重启客户端
  ipcMain.handle('app:relaunch', () => {
    try {
      app.relaunch()
      app.exit(0)
      return { success: true }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  })

  createWindow()

  // 应用启动后主动检查更新（不会自动下载）
  autoUpdater.checkForUpdates().catch(() => { })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
