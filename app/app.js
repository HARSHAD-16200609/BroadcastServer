import WebSocket from "ws";
import readline from "readline";
import chalk from "chalk";

export function startClient(url) {
  let ws;
  let rl;
  let isConnected = false;
  let isClosing = false;

  try {
    // Validate URL format
    if (!url) {
      throw new Error("URL is required");
    }

    // Add ws:// protocol if not present
    let wsUrl = url;
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      wsUrl = `ws://${url}`;
    }

    console.log(chalk.yellow(`⚠ Connecting to ${wsUrl}...`));

    ws = new WebSocket(wsUrl);

    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!isConnected) {
        console.error(chalk.red.bold(`✗ Connection timeout - Could not connect to server`));
        console.log(chalk.yellow(`⚠ Please check if the server is running and the URL is correct`));
        process.exit(1);
      }
    }, 10000); // 10 second timeout

    ws.on("open", () => {
      clearTimeout(connectionTimeout);
      isConnected = true;
      console.log(chalk.green.bold(`🟢 Connected to server`));
      console.log("Type messages. Use /exit to quit.\n");

      try {
        rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: ''
        });

        rl.on("line", (input) => {
          try {
            if (input === "/exit") {
              console.log(chalk.yellow(`⚠ Disconnecting...`));
              isClosing = true;
              rl.close();
              ws.close(1000, "User requested disconnect");
              return;
            }

            if (!input || input.trim().length === 0) {
              console.warn(chalk.yellow(`⚠ Cannot send empty message`));
              return;
            }

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(input);
            } else {
              console.error(chalk.red.bold(`✗ Cannot send message - Not connected to server`));
            }
          } catch (error) {
            console.error(chalk.red.bold(`✗ Error sending message:`), error.message);
          }
        });

        rl.on("close", () => {
          if (!isClosing) {
            isClosing = true;
            try {
              ws.close();
            } catch (e) {
              // Silently fail
            }
            process.exit(0);
          }
        });
      } catch (error) {
        console.error(chalk.red.bold(`✗ Error setting up readline interface:`), error.message);
        ws.close();
        process.exit(1);
      }
    });

    ws.on("message", (msg) => {
      try {
        console.log(msg.toString());
      } catch (error) {
        console.error(chalk.red.bold(`✗ Error displaying message:`), error.message);
      }
    });

    ws.on("error", (error) => {
      if (error.code === "ECONNREFUSED") {
        console.error(chalk.red.bold(`✗ Connection refused - Server is not running or unreachable`));
        console.log(chalk.yellow(`⚠ Please check:`));
        console.log(`  1. Server is running`);
        console.log(`  2. URL is correct: ${wsUrl}`);
        console.log(`  3. No firewall blocking the connection`);
      } else if (error.code === "ENOTFOUND") {
        console.error(chalk.red.bold(`✗ Host not found - Invalid URL`));
        console.log(chalk.yellow(`⚠ Please check the server URL: ${wsUrl}`));
      } else if (error.code === "ETIMEDOUT") {
        console.error(chalk.red.bold(`✗ Connection timed out`));
        console.log(chalk.yellow(`⚠ Server is not responding`));
      } else {
        console.error(chalk.red.bold(`✗ WebSocket error:`), error.message);
      }

      if (!isConnected) {
        process.exit(1);
      }
    });

    ws.on("close", (code, reason) => {
      isConnected = false;
      const reasonText = reason ? ` (Reason: ${reason})` : '';

      if (isClosing) {
        console.log(chalk.green.bold(`🔴 Disconnected from server${reasonText}`));
      } else {
        console.log(chalk.red.bold(`🔴 Connection lost${reasonText}`));

        // Provide helpful messages based on close code
        if (code === 1006) {
          console.log(chalk.yellow(`⚠ Abnormal closure - Server may have crashed or network issue`));
        } else if (code === 1011) {
          console.log(chalk.yellow(`⚠ Server encountered an error`));
        }
      }

      if (rl) {
        try {
          rl.close();
        } catch (e) {
          // Silently fail
        }
      }

      process.exit(isClosing ? 0 : 1);
    });

    // Handle process termination
    process.on("SIGINT", () => {
      console.log(`\n${chalk.yellow("⚠ Interrupted - Disconnecting...")}`);
      isClosing = true;

      if (rl) {
        try {
          rl.close();
        } catch (e) {
          // Silently fail
        }
      }

      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.close(1000, "User interrupted");
        } catch (e) {
          // Silently fail
        }
      }

      setTimeout(() => {
        process.exit(0);
      }, 500);
    });

    process.on("SIGTERM", () => {
      console.log(`\n${chalk.yellow("⚠ SIGTERM received - Disconnecting...")}`);
      process.emit("SIGINT");
    });

  } catch (error) {
    console.error(chalk.red.bold(`✗ Failed to start client:`), error.message);
    console.log(chalk.yellow(`⚠ Usage: broadcast-server connect <ws://server-url:port>`));
    process.exit(1);
  }
}
