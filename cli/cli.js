#!/usr/bin/env node

import chalk from "chalk";
import { startServer } from "../server/server.js";
import { startClient } from "../app/app.js";

const args = process.argv.slice(2);
const command = args[0];
const url = args[1] || process.env.PORT || 8080;

function showUsage() {
  console.log(`
${chalk.cyan.bold("╔════════════════════════════════════════════════════════════╗")}
${chalk.cyan.bold("║")}           ${chalk.white.bold("Broadcast Server CLI - Usage Guide")}             ${chalk.cyan.bold("║")}
${chalk.cyan.bold("╚════════════════════════════════════════════════════════════╝")}

${chalk.yellow.bold("Commands:")}

  ${chalk.cyan("start")} ${chalk.gray("[port]")}
    Start the WebSocket broadcast server
    ${chalk.yellow("Example:")} broadcast-server start
    ${chalk.yellow("Example:")} broadcast-server start 3000

  ${chalk.cyan("connect")} ${chalk.gray("<url>")}
    Connect to a broadcast server as a client
    ${chalk.yellow("Example:")} broadcast-server connect ws://localhost:8000
    ${chalk.yellow("Example:")} broadcast-server connect localhost:8000

${chalk.yellow.bold("Environment Variables:")}
  ${chalk.cyan("PORT")} - Default port for the server (default: 8000)

${chalk.yellow.bold("For more information, visit:")}
  ${chalk.cyan.underline("https://broadcastserver.onrender.com")}
`);
}

try {
  switch (command) {
    case "start":
      try {
        const port = parseInt(url, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
          console.error(chalk.red.bold(`✗ Invalid port number: ${url}`));
          console.log(chalk.yellow(`⚠ Port must be between 1 and 65535`));
          process.exit(1);
        }
        startServer(port);
      } catch (error) {
        console.error(chalk.red.bold(`✗ Error starting server:`), error.message);
        process.exit(1);
      }
      break;

    case "connect":
      if (!url || url === "8080") {
        console.error(chalk.red.bold(`✗ Server URL is required for connect command`));
        console.log(chalk.yellow(`⚠ Usage: broadcast-server connect <server-url>`));
        console.log(chalk.yellow(`⚠ Example: broadcast-server connect ws://localhost:8000`));
        process.exit(1);
      }

      try {
        startClient(url);
      } catch (error) {
        console.error(chalk.red.bold(`✗ Error connecting to server:`), error.message);
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
            console.log(chalk.cyan.bold(`Broadcast Server CLI v${pkg.default.version}`));
            process.exit(0);
          })
          .catch(() => {
            console.log(chalk.cyan.bold(`Broadcast Server CLI`));
            process.exit(0);
          });
      } catch (error) {
        console.log(chalk.cyan.bold(`Broadcast Server CLI`));
        process.exit(0);
      }
      break;

    default:
      if (command) {
        console.error(chalk.red.bold(`✗ Unknown command: ${command}\n`));
      } else {
        console.error(chalk.red.bold(`✗ No command specified\n`));
      }
      showUsage();
      process.exit(1);
  }
} catch (error) {
  console.error(chalk.red.bold(`✗ Fatal error:`), error.message);
  console.error(chalk.red(error.stack));
  process.exit(1);
}
