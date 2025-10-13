import express from 'express'
import { logger } from '../logger/logger'

const app = express()
const port = 5030

app.get('/', (_req, res) => {
  logger.info('Received request on /')
  res.send('<div style="font-size: 24px;">Not allow to access this endpoint</div>')
})

app.listen(port)
// default port 5030, localhost
