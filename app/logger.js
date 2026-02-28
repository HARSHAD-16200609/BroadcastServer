/**
 * Logger utility for consistent error and info logging across the application
 */

import chalk from "chalk";

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
function formatMessage(level, message, colorFn, symbol) {
  const timestamp = getTimestamp();
  return `${chalk.dim(`[${timestamp}]`)} ${colorFn(`${symbol} ${level}:`)} ${message}`;
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
      chalk.red.bold,
      symbols.error
    );
    console.error(formattedMsg);

    if (error) {
      if (error.stack && this.enableDebug) {
        console.error(chalk.dim(error.stack));
      } else if (error.message) {
        console.error(chalk.red(`  → ${error.message}`));
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
      chalk.yellow.bold,
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
      chalk.cyan.bold,
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
      chalk.green.bold,
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
      chalk.dim,
      symbols.debug
    );
    console.log(formattedMsg);

    if (data) {
      console.log(chalk.dim(JSON.stringify(data, null, 2)));
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
