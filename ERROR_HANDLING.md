# Error Handling & Logging Guide

## Overview

The Broadcast Server CLI now includes comprehensive error handling and logging to provide a robust and user-friendly experience.

## Features

### 🛡️ Error Handling

#### Server (`server/server.js`)
- **WebSocket Connection Errors**: Gracefully handles client connection failures
- **Message Processing Errors**: Catches and logs errors when processing messages
- **Port Conflicts**: Detects when a port is already in use (EADDRINUSE)
- **Permission Errors**: Identifies permission issues (EACCES)
- **Graceful Shutdown**: Properly closes all connections on SIGINT/SIGTERM
- **Client Tracking**: Logs total connected clients for monitoring
- **Uncaught Exceptions**: Global handlers for unexpected errors

#### Client (`app/app.js`)
- **Connection Timeout**: 10-second timeout for connection attempts
- **Connection Refused**: Helpful messages when server is unreachable
- **Invalid URL**: Validates and auto-formats WebSocket URLs
- **Network Errors**: Specific error messages for different network issues
- **Empty Messages**: Prevents sending empty messages
- **Graceful Disconnection**: Clean shutdown on user exit or interruption

#### CLI (`cli/cli.js`)
- **Command Validation**: Validates all commands and arguments
- **Port Validation**: Ensures port numbers are valid (1-65535)
- **URL Validation**: Checks for required URLs in connect command
- **Help Command**: Comprehensive usage guide
- **Version Command**: Display CLI version
- **Unknown Commands**: Helpful error messages for invalid commands

### 📊 Logging System

#### Color-Coded Messages
- 🔴 **Red**: Errors and critical issues
- 🟡 **Yellow**: Warnings and important notices
- 🟢 **Green**: Success messages
- 🔵 **Cyan**: Informational messages
- ⚫ **Gray**: Debug information (when enabled)

#### Log Levels
- **ERROR** (✗): Critical errors that need attention
- **WARN** (⚠): Warnings and potential issues
- **INFO** (ℹ): General information
- **SUCCESS** (✓): Successful operations
- **DEBUG** (◆): Detailed debugging info (development only)

#### Using the Logger

```javascript
import { Logger, log } from './app/logger.js';

// Use the default logger
log.error('Something went wrong', error);
log.warn('This might be an issue');
log.info('Server started');
log.success('Connection established');
log.debug('Debug data', { key: 'value' });

// Create a context-specific logger
const serverLogger = new Logger('SERVER');
serverLogger.error('Server error occurred');

// Create child loggers
const wsLogger = serverLogger.child('WebSocket');
wsLogger.info('New connection');
```

#### Enable Debug Mode

Set the `DEBUG` environment variable or `NODE_ENV` to development:

```bash
# Windows PowerShell
$env:DEBUG="true"
broadcast-server start

# Linux/Mac
DEBUG=true broadcast-server start
```

## Error Messages

### Server Errors

| Error | Message | Solution |
|-------|---------|----------|
| Port in use | `✗ Error: Port 8000 is already in use` | Use a different port or stop the process using that port |
| Permission denied | `✗ Error: Permission denied to use port 80` | Use a port number above 1024 |
| Connection error | `✗ WebSocket error for [username]` | Check network connectivity |

### Client Errors

| Error | Message | Solution |
|-------|---------|----------|
| Connection refused | `✗ Connection refused - Server is not running` | Start the server first |
| Invalid URL | `✗ Host not found - Invalid URL` | Check the server URL format |
| Connection timeout | `✗ Connection timeout` | Verify server is running and reachable |
| Empty message | `⚠ Cannot send empty message` | Type a message before sending |

### CLI Errors

| Error | Message | Solution |
|-------|---------|----------|
| Invalid port | `✗ Invalid port number: abc` | Use a valid port number (1-65535) |
| Missing URL | `✗ Server URL is required` | Provide a server URL for connect command |
| Unknown command | `✗ Unknown command: foo` | Use `broadcast-server help` to see available commands |

## Best Practices

### 1. Always Check Logs
When something goes wrong, check the console output for color-coded error messages that explain the issue.

### 2. Use Graceful Shutdown
Always use `Ctrl+C` to stop the server. This ensures:
- All client connections are properly closed
- Resources are cleaned up
- No orphaned processes

### 3. Handle Errors in Production
In production environments:
- Monitor logs for errors
- Set up log aggregation
- Configure alerts for critical errors

### 4. Debug Mode
Enable debug mode during development to see:
- Detailed stack traces
- Internal state information
- Message flow details

## Examples

### Starting Server with Error Handling

```bash
# Start server on default port
broadcast-server start

# Start server on custom port
broadcast-server start 3000

# Invalid port (will show error)
broadcast-server start 99999
```

### Connecting with Error Handling

```bash
# Connect to server
broadcast-server connect ws://localhost:8000

# Auto-format URL (adds ws://)
broadcast-server connect localhost:8000

# Missing URL (will show error)
broadcast-server connect
```

### Viewing Help

```bash
broadcast-server help
broadcast-server --help
broadcast-server -h
```

### Checking Version

```bash
broadcast-server version
broadcast-server --version
broadcast-server -v
```

## Troubleshooting

### Server won't start
1. Check if port is already in use
2. Try a different port number
3. Check firewall settings
4. Verify Node.js version (>= 14.0.0)

### Client can't connect
1. Verify server is running
2. Check the URL format
3. Ensure no firewall blocking
4. Try connecting to localhost first

### Messages not sending
1. Check connection status
2. Ensure message is not empty
3. Verify WebSocket connection is open
4. Check server logs for errors

## Contributing

When adding new features:
1. Add appropriate error handling
2. Use the Logger utility for consistent logging
3. Provide helpful error messages
4. Test error scenarios
5. Update this documentation

## Support

For issues or questions:
- Check the error message and this guide
- Enable debug mode for more details
- Visit: https://broadcastserver.onrender.com
- Report issues on GitHub
