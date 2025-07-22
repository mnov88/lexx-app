// Structured logging system for production readiness

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogContext {
  userId?: string
  sessionId?: string
  requestId?: string
  userAgent?: string
  ip?: string
  path?: string
  method?: string
  statusCode?: number
  duration?: number
  error?: Error | string
  metadata?: Record<string, any>
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context: LogContext
  environment: string
  service: string
}

class Logger {
  private static instance: Logger
  private minLevel: LogLevel
  private environment: string
  private service: string

  constructor() {
    this.minLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
    this.environment = process.env.NODE_ENV || 'development'
    this.service = 'lexx-api'
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel
  }

  private formatLogEntry(level: LogLevel, message: string, context: LogContext = {}): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        // Add correlation ID if available
        requestId: context.requestId || this.generateRequestId()
      },
      environment: this.environment,
      service: this.service
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private output(entry: LogEntry): void {
    if (this.environment === 'production') {
      // Structured JSON logging for production
      console.log(JSON.stringify(entry))
    } else {
      // Human-readable logging for development
      const levelName = LogLevel[entry.level]
      const timestamp = entry.timestamp.split('T')[1]?.split('.')[0]
      
      let logMessage = `[${timestamp}] ${levelName}: ${entry.message}`
      
      if (entry.context.path) {
        logMessage += ` | ${entry.context.method || 'GET'} ${entry.context.path}`
      }
      
      if (entry.context.statusCode) {
        logMessage += ` | ${entry.context.statusCode}`
      }
      
      if (entry.context.duration) {
        logMessage += ` | ${entry.context.duration}ms`
      }
      
      if (entry.context.userId) {
        logMessage += ` | user:${entry.context.userId}`
      }
      
      console.log(logMessage)
      
      // Additional context for non-production
      if (Object.keys(entry.context).length > 3) {
        console.log('Context:', entry.context)
      }
      
      if (entry.context.error && entry.level >= LogLevel.ERROR) {
        console.error(entry.context.error)
      }
    }
  }

  public debug(message: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.output(this.formatLogEntry(LogLevel.DEBUG, message, context))
    }
  }

  public info(message: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.output(this.formatLogEntry(LogLevel.INFO, message, context))
    }
  }

  public warn(message: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.output(this.formatLogEntry(LogLevel.WARN, message, context))
    }
  }

  public error(message: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.output(this.formatLogEntry(LogLevel.ERROR, message, context))
    }
  }

  public fatal(message: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.FATAL)) {
      this.output(this.formatLogEntry(LogLevel.FATAL, message, context))
    }
  }

  // Specialized logging methods for common scenarios
  public apiRequest(method: string, path: string, context: LogContext = {}): void {
    this.info(`${method} ${path}`, {
      ...context,
      method,
      path
    })
  }

  public apiResponse(method: string, path: string, statusCode: number, duration: number, context: LogContext = {}): void {
    const level = statusCode >= 500 ? LogLevel.ERROR : 
                 statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
    
    this[LogLevel[level].toLowerCase() as 'info' | 'warn' | 'error'](`${method} ${path} ${statusCode}`, {
      ...context,
      method,
      path,
      statusCode,
      duration
    })
  }

  public authEvent(event: string, userId?: string, context: LogContext = {}): void {
    this.info(`Auth: ${event}`, {
      ...context,
      userId,
      metadata: { ...context.metadata, event }
    })
  }

  public securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context: LogContext = {}): void {
    const level = severity === 'critical' ? LogLevel.FATAL :
                 severity === 'high' ? LogLevel.ERROR :
                 severity === 'medium' ? LogLevel.WARN : LogLevel.INFO

    this[LogLevel[level].toLowerCase() as 'info' | 'warn' | 'error' | 'fatal'](`Security: ${event}`, {
      ...context,
      metadata: { ...context.metadata, event, severity }
    })
  }

  public performanceMetric(operation: string, duration: number, context: LogContext = {}): void {
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.INFO
    
    this[LogLevel[level].toLowerCase() as 'info' | 'warn'](`Performance: ${operation} took ${duration}ms`, {
      ...context,
      duration,
      metadata: { ...context.metadata, operation }
    })
  }

  public databaseQuery(query: string, duration: number, context: LogContext = {}): void {
    this.debug(`DB Query: ${query}`, {
      ...context,
      duration,
      metadata: { ...context.metadata, query: query.substring(0, 100) + (query.length > 100 ? '...' : '') }
    })
  }

  public cacheEvent(event: 'hit' | 'miss' | 'set' | 'delete', key: string, context: LogContext = {}): void {
    this.debug(`Cache ${event}: ${key}`, {
      ...context,
      metadata: { ...context.metadata, event, key }
    })
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Request logging middleware helper
export function createRequestLogger(requestId?: string) {
  return {
    debug: (message: string, context: LogContext = {}) => 
      logger.debug(message, { ...context, requestId }),
    info: (message: string, context: LogContext = {}) => 
      logger.info(message, { ...context, requestId }),
    warn: (message: string, context: LogContext = {}) => 
      logger.warn(message, { ...context, requestId }),
    error: (message: string, context: LogContext = {}) => 
      logger.error(message, { ...context, requestId }),
    apiRequest: (method: string, path: string, context: LogContext = {}) =>
      logger.apiRequest(method, path, { ...context, requestId }),
    apiResponse: (method: string, path: string, statusCode: number, duration: number, context: LogContext = {}) =>
      logger.apiResponse(method, path, statusCode, duration, { ...context, requestId })
  }
}

// Error tracking utilities
export function logError(error: Error, context: LogContext = {}): void {
  logger.error(error.message, {
    ...context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  })
}

export function logApiError(error: Error, method: string, path: string, context: LogContext = {}): void {
  logger.error(`API Error: ${method} ${path}`, {
    ...context,
    method,
    path,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  })
}

// Higher-order function to add logging to API handlers
export function withLogging<T extends any[]>(
  handler: (request: Request, ...args: T) => Promise<Response>
) {
  return async (request: Request, ...args: T): Promise<Response> => {
    const start = Date.now()
    const method = request.method
    const url = new URL(request.url)
    const path = url.pathname
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    const requestLogger = createRequestLogger(requestId)
    
    // Log request
    requestLogger.apiRequest(method, path, {
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          undefined
    })
    
    try {
      const response = await handler(request, ...args)
      const duration = Date.now() - start
      
      // Log response
      requestLogger.apiResponse(method, path, response.status, duration)
      
      return response
    } catch (error) {
      const duration = Date.now() - start
      
      // Log error
      logApiError(error as Error, method, path, {
        requestId,
        duration
      })
      
      // Log error response
      requestLogger.apiResponse(method, path, 500, duration)
      
      throw error
    }
  }
}