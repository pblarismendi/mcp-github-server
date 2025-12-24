/**
 * Logger estructurado para el servidor MCP
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  tool?: string;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private level: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Mantener últimos 1000 logs en memoria

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private log(level: LogLevel, levelName: string, message: string, metadata?: Record<string, any>) {
    if (level < this.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      message,
      ...metadata,
    };

    this.logs.push(entry);

    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Output a stderr (estándar para logs en MCP)
    const logLine = JSON.stringify(entry);
    console.error(`[${levelName}] ${logLine}`);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, 'DEBUG', message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, 'INFO', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, 'WARN', message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log(
      LogLevel.ERROR,
      'ERROR',
      message,
      error
        ? {
            ...metadata,
            error: error.message,
            stack: error.stack,
          }
        : metadata
    );
  }

  // Métricas de herramientas
  toolStart(toolName: string, args?: Record<string, any>) {
    this.debug(`Tool started: ${toolName}`, { tool: toolName, args });
  }

  toolEnd(toolName: string, duration: number, success: boolean) {
    this.info(`Tool completed: ${toolName}`, {
      tool: toolName,
      duration,
      success,
    });
  }

  // Obtener logs recientes
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Obtener estadísticas
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
      },
      byTool: {} as Record<string, number>,
    };

    for (const log of this.logs) {
      stats.byLevel[log.level.toLowerCase() as keyof typeof stats.byLevel]++;
      if (log.tool) {
        stats.byTool[log.tool] = (stats.byTool[log.tool] || 0) + 1;
      }
    }

    return stats;
  }

  // Limpiar logs
  clear() {
    this.logs = [];
  }
}

// Instancia global del logger
export const logger = new Logger(
  process.env.LOG_LEVEL === 'DEBUG' ? LogLevel.DEBUG : LogLevel.INFO
);

