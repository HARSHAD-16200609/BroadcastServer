/**
 * Logger utility for consistent error and info logging across the application
 */

// ANSI color codes
export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  
  // Regular colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  
  // Bright colors
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
};

// Log levels
export const LogLevel = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
  SUCCESS: "SUCCESS",
};

// Symbols for different log types
const symbols = {
  error: "✗",
  warn: "⚠",
  info: "ℹ",
  debug: "◆",
  success: "✓",
};

/**
 * Get timestamp in readable format
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Format log message with color and symbol
 */
function formatMessage(level, message, color, symbol) {
  const timestamp = getTimestamp();
  return `${colors.dim}[${timestamp}]${colors.reset} ${color}${symbol} ${level}:${colors.reset} ${message}`;
}

/**
 * Logger class for structured logging
 */
export class Logger {
  constructor(context = "APP") {
    this.context = context;
    this.enableDebug = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    const formattedMsg = formatMessage(
      LogLevel.ERROR,
      `[${this.context}] ${message}`,
      colors.brightRed,
      symbols.error
    );
    console.error(formattedMsg);
    
    if (error) {
      if (error.stack && this.enableDebug) {
        console.error(`${colors.dim}${error.stack}${colors.reset}`);
      } else if (error.message) {
        console.error(`${colors.red}  → ${error.message}${colors.reset}`);
      }
    }
  }

  /**
   * Log warning message
   */
  warn(message) {
    const formattedMsg = formatMessage(
      LogLevel.WARN,
      `[${this.context}] ${message}`,
      colors.brightYellow,
      symbols.warn
    );
    console.warn(formattedMsg);
  }

  /**
   * Log info message
   */
  info(message) {
    const formattedMsg = formatMessage(
      LogLevel.INFO,
      `[${this.context}] ${message}`,
      colors.brightCyan,
      symbols.info
    );
    console.log(formattedMsg);
  }

  /**
   * Log success message
   */
  success(message) {
    const formattedMsg = formatMessage(
      LogLevel.SUCCESS,
      `[${this.context}] ${message}`,
      colors.brightGreen,
      symbols.success
    );
    console.log(formattedMsg);
  }

  /**
   * Log debug message (only in debug mode)
   */
  debug(message, data = null) {
    if (!this.enableDebug) return;
    
    const formattedMsg = formatMessage(
      LogLevel.DEBUG,
      `[${this.context}] ${message}`,
      colors.dim,
      symbols.debug
    );
    console.log(formattedMsg);
    
    if (data) {
      console.log(`${colors.dim}${JSON.stringify(data, null, 2)}${colors.reset}`);
    }
  }

  /**
   * Create a child logger with a different context
   */
  child(context) {
    return new Logger(`${this.context}:${context}`);
  }
}

// Create default logger instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  error: (msg, err) => logger.error(msg, err),
  warn: (msg) => logger.warn(msg),
  info: (msg) => logger.info(msg),
  success: (msg) => logger.success(msg),
  debug: (msg, data) => logger.debug(msg, data),
};

export default logger;
