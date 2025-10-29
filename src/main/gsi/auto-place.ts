import type { IpcMain } from 'electron'
import { dialog } from 'electron'
import { join, dirname } from 'path'
import fs from 'fs'

// Register IPC handler to auto place GSI cfg into game/csgo/cfg
export function registerAutoPlaceGSIIPC(ipc: IpcMain): void {
  ipc.handle('gsi:auto-place', async () => {
    try {
      // Only pass options to avoid type issue with undefined window
      const res = await dialog.showOpenDialog({
        title: 'Choose cs2.exe',
        properties: ['openFile'],
        filters: [{ name: 'Executable', extensions: ['exe'] }]
      })

      if (res.canceled || !res.filePaths?.length) {
        return { success: false, message: 'Operation canceled' }
      }

      const exePath = res.filePaths[0]
      // cs2.exe path is <root>\\game\\bin\\win64\\cs2.exe
      const win64Dir = dirname(exePath)
      const binDir = dirname(win64Dir)
      const gameDir = dirname(binDir)
      const cfgDir = join(gameDir, 'csgo', 'cfg')

      // Resolve cfg source from copied main output (same dir as this file) or dev source
      const candidates = [
        join(__dirname, 'gsi', 'gamestate_integration_voidhud.cfg'),
        join(process.cwd(), 'src', 'renderer', 'src', 'multi', 'gamestate_integration_voidhud.cfg')
      ]
      const source = candidates.find((p) => {
        try {
          return fs.existsSync(p)
        } catch {
          return false
        }
      })

      if (!source) {
        return { success: false, message: 'Cannot find config source file (cfg)' }
      }

      try {
        fs.mkdirSync(cfgDir, { recursive: true })
      } catch {}

      const target = join(cfgDir, 'gamestate_integration_voidhud.cfg')
      const content = fs.readFileSync(source, 'utf-8')
      fs.writeFileSync(target, content, 'utf-8')

      return { success: true, message: `GSI file placed to: ${target}`, targetPath: target }
    } catch (err: any) {
      return { success: false, message: String(err?.message ?? err) }
    }
  })
}
