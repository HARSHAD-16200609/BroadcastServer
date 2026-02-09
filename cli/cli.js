#!/usr/bin/env node

import { startServer } from "../server/server.js";
import { startClient } from "../app/app.js";

const errorColor = "\x1b[91m"; // Bright red for errors
const warningColor = "\x1b[93m"; // Bright yellow for warnings
const resetColor = "\x1b[0m";
const infoColor = "\x1b[96m"; // Bright cyan for info

const args = process.argv.slice(2);
const command = args[0];
const url = args[1] || process.env.PORT || 8080;

function showUsage() {
  console.log(`
${infoColor}╔════════════════════════════════════════════════════════════╗
║           Broadcast Server CLI - Usage Guide              ║
╚════════════════════════════════════════════════════════════╝${resetColor}

${warningColor}Commands:${resetColor}

  ${infoColor}start [port]${resetColor}
    Start the WebSocket broadcast server
    ${warningColor}Example:${resetColor} broadcast-server start
    ${warningColor}Example:${resetColor} broadcast-server start 3000

  ${infoColor}connect <url>${resetColor}
    Connect to a broadcast server as a client
    ${warningColor}Example:${resetColor} broadcast-server connect ws://localhost:8000
    ${warningColor}Example:${resetColor} broadcast-server connect localhost:8000

${warningColor}Environment Variables:${resetColor}
  PORT - Default port for the server (default: 8000)

${warningColor}For more information, visit:${resetColor}
  https://broadcastserver.onrender.com
`);
}

try {
  switch (command) {
    case "start":
      try {
        const port = parseInt(url, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
          console.error(`${errorColor}✗ Invalid port number: ${url}${resetColor}`);
          console.log(`${warningColor}⚠ Port must be between 1 and 65535${resetColor}`);
          process.exit(1);
        }
        startServer(port);
      } catch (error) {
        console.error(`${errorColor}✗ Error starting server:${resetColor}`, error.message);
        process.exit(1);
      }
      break;

    case "connect":
      if (!url || url === "8080") {
        console.error(`${errorColor}✗ Server URL is required for connect command${resetColor}`);
        console.log(`${warningColor}⚠ Usage: broadcast-server connect <server-url>${resetColor}`);
        console.log(`${warningColor}⚠ Example: broadcast-server connect ws://localhost:8000${resetColor}`);
        process.exit(1);
      }
      
      try {
        startClient(url);
      } catch (error) {
        console.error(`${errorColor}✗ Error connecting to server:${resetColor}`, error.message);
        process.exit(1);
      }
      break;

    case "help":
    case "--help":
    case "-h":
      showUsage();
      process.exit(0);
      break;

    case "version":
    case "--version":
    case "-v":
      try {
        // Read package.json to get version
        import("../package.json", { assert: { type: "json" } })
          .then((pkg) => {
            console.log(`${infoColor}Broadcast Server CLI v${pkg.default.version}${resetColor}`);
            process.exit(0);
          })
          .catch(() => {
            console.log(`${infoColor}Broadcast Server CLI${resetColor}`);
            process.exit(0);
          });
      } catch (error) {
        console.log(`${infoColor}Broadcast Server CLI${resetColor}`);
        process.exit(0);
      }
      break;

    default:
      if (command) {
        console.error(`${errorColor}✗ Unknown command: ${command}${resetColor}\n`);
      } else {
        console.error(`${errorColor}✗ No command specified${resetColor}\n`);
      }
      showUsage();
      process.exit(1);
  }
} catch (error) {
  console.error(`${errorColor}✗ Fatal error:${resetColor}`, error.message);
  console.error(error.stack);
  process.exit(1);
}
