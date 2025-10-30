import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { CSGOGSI } from 'csgogsi'
import { databaseService } from '../database/database'
import { join } from 'path'
import { applyFilters } from './filters'
import { app as electronApp, globalShortcut } from 'electron'

const expressApp = express()
const GSI = new CSGOGSI()
const server = http.createServer(expressApp)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// New Socket.IO namespace for realtime channel
const realtime = io.of('/realtime')

expressApp.use(express.urlencoded({ extended: true }))
expressApp.use(express.json({ limit: '12Mb' }))

// Listen for GSI data
expressApp.post('/gsi', (req, res) => {
  GSI.digest(req.body)
  res.sendStatus(200)
})

expressApp.use('/overlay', express.static(join(__dirname, 'overlay/file')))

// Transmit GSI data by Socket.IO
GSI.on('data', async (data) => {
  const settings = await databaseService.settings.getAll()
  const match = await databaseService.matchs.getAll()
  const gamedata = await applyFilters(data as any)
  // applyFilters(gamedata, { sortPlayersByObserverSlot: true })
  io.emit('gsi-data', { ...gamedata, settings, match })
})

const PORT = 5031
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Register global shortcut F5 to emit realtime: refresh-now
electronApp.whenReady().then(() => {
  try {
    const ok = globalShortcut.register('Ctrl+Alt+F5', () => {
      // Emit to namespace '/realtime' with event 'refresh-now'
      realtime.emit('refresh-now')
      console.log('Ctrl+Alt+F5 shortcut pressed, emitted refresh-now on /realtime')
    })
    if (!ok) {
      console.warn('Failed to register global shortcut Ctrl+Alt+F5')
    }
  } catch (err) {
    console.error('Error registering Ctrl+Alt+F5 shortcut:', err)
  }
})

electronApp.on('will-quit', () => {
  try {
    globalShortcut.unregister('F5')
    globalShortcut.unregisterAll()
  } catch {}
})
