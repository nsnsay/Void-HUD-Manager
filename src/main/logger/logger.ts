import { ipcMain } from 'electron'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, appendFileSync } from 'fs'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  levelName: string
  message: string
  context?: string
}

class Logger {
  private static instance: Logger
  private logPath: string
  private logLevel: LogLevel = LogLevel.INFO

  private constructor() {
    const logsDir = join(app.getPath('userData'), 'Logs')
    console.log('logsDir', logsDir)
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true })
    }
    this.logPath = join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`)
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const levelName = LogLevel[level]
    const contextStr = context ? `[${context}] ` : ''
    return `[${timestamp}] ${levelName} ${contextStr}${message}`
  }

  private writeToFile(logEntry: LogEntry): void {
    try {
      const logLine = `[${logEntry.timestamp}] ${logEntry.levelName} ${logEntry.context ? `[${logEntry.context}] ` : ''}${logEntry.message}\n`
      appendFileSync(this.logPath, logLine)
    } catch (error) {
      console.error('Failed to write log to file:', error)
    }
  }

  private log(level: LogLevel, message: string, context?: string): void {
    if (level < this.logLevel) return

    const timestamp = new Date().toISOString()
    const levelName = LogLevel[level]
    const logEntry: LogEntry = {
      timestamp,
      level,
      levelName,
      message,
      context
    }

    const formattedMessage = this.formatMessage(level, message, context)

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage)
        break
      case LogLevel.INFO:
        console.info(formattedMessage)
        break
      case LogLevel.WARN:
        console.warn(formattedMessage)
        break
      case LogLevel.ERROR:
        console.error(formattedMessage)
        break
    }

    this.writeToFile(logEntry)
  }

  public debug(message: string, context?: string): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  public info(message: string, context?: string): void {
    this.log(LogLevel.INFO, message, context)
  }

  public warn(message: string, context?: string): void {
    this.log(LogLevel.WARN, message, context)
  }

  public error(message: string, context?: string): void {
    this.log(LogLevel.ERROR, message, context)
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  public getLogLevel(): LogLevel {
    return this.logLevel
  }
}

export const logger = Logger.getInstance()

export function setupLoggerIPC(): void {
  ipcMain.handle('logger:debug', (_, message: string, context?: string) => {
    logger.debug(message, context)
  })

  ipcMain.handle('logger:info', (_, message: string, context?: string) => {
    logger.info(message, context)
  })

  ipcMain.handle('logger:warn', (_, message: string, context?: string) => {
    logger.warn(message, context)
  })

  ipcMain.handle('logger:error', (_, message: string, context?: string) => {
    logger.error(message, context)
  })

  ipcMain.handle('logger:setLevel', (_, level: LogLevel) => {
    logger.setLogLevel(level)
  })

  ipcMain.handle('logger:getLevel', () => {
    return logger.getLogLevel()
  })
}

setupLoggerIPC()
