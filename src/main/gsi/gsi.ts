import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { CSGOGSI } from 'csgogsi'
import { databaseService } from '../database/database'
import { join } from 'path'
import { applyFilters } from './filters'
import { app as electronApp, globalShortcut } from 'electron'
import cors from 'cors'

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
expressApp.use(cors())

// Listen for GSI data
expressApp.post('/gsi', (req, res) => {
  GSI.digest(req.body)
  res.sendStatus(200)
})

// Database API
expressApp.get('/api/players/:steamid', async (req, res) => {
  try {
    const { steamid } = req.params
    const players = await databaseService.players.getAll()
    const player = players.find((p) => {
      const pid = String((p as any).steamid ?? (p as any).steamID ?? (p as any).steamId ?? '')
      return pid === steamid
    })
    if (player) res.json(player)
    else res.status(404).json({ error: 'Player not found' })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

expressApp.get('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params
    const team = await databaseService.teams.getById(id)
    if (team) res.json(team)
    else res.status(404).json({ error: `Team not found, return ${team}` })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

expressApp.get('/api/players', async (_req, res) => {
  const data = await databaseService.players.getAll()
  res.json(data)
})

expressApp.get('/api/teams', async (_req, res) => {
  const data = await databaseService.teams.getAll()
  res.json(data)
})

expressApp.get('/api/matchs', async (_req, res) => {
  const data = await databaseService.matchs.getAll()
  res.json(data)
})

expressApp.get('/api/settings', async (_req, res) => {
  const data = await databaseService.settings.getAll()
  res.json(data)
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
let shortcutKey = 'Ctrl+Alt+F5'

const getShortcutKey = async () => {
  try {
    const settings = await databaseService.settings.getAll()
    return settings.shortcutKey || 'Ctrl+Alt+F5'
  } catch (error) {
    console.error('Failed to get shortcut key settings:', error)
    return 'Ctrl+Alt+F5'
  }
}

electronApp.whenReady().then(async () => {
  try {
    shortcutKey = await getShortcutKey()
    const ok = globalShortcut.register(shortcutKey, () => {
      realtime.emit('refresh-now')
      console.log(`${shortcutKey} shortcut pressed, emitted refresh-now on /realtime`)
    })
    if (!ok) {
      console.warn(`Failed to register global shortcut ${shortcutKey}`)
    }
  } catch (err) {
    console.error(`Error registering ${shortcutKey} shortcut:`, err)
  }
})

electronApp.on('will-quit', () => {
  try {
    globalShortcut.unregister(shortcutKey)
    globalShortcut.unregisterAll()
  } catch {}
})
