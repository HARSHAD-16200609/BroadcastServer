import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import chalk from "chalk";
import { animeProtagonists } from "../app/usernames.js";

export function startServer(port = 8080) {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });
  const clients = new Set();

  const colors = [
    chalk.red,
    chalk.green,
    chalk.yellow,
    chalk.blue,
    chalk.magenta,
    chalk.cyan,
  ];

  function sendMessages(data, ws) {
    try {
      const styledUsername = chalk.bgGray.white.bold(` ${ws.username} `);
      const message = `${styledUsername} ${ws.color("●")} : ${data.toString()}`;

      for (const client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          try {
            client.send(message);
          } catch (sendError) {
            console.error(chalk.red.bold(`✗ Error sending message to client:`), sendError.message);
            // Don't remove client here, let the error/close handlers deal with it
          }
        }
      }
    } catch (error) {
      console.error(chalk.red.bold(`✗ Error in sendMessages:`), error.message);
    }
  }

  wss.on("connection", (ws, req) => {
    try {
      // Parse the URL to get the query string
      const baseURL = req.headers.host ? `http://${req.headers.host}` : 'http://localhost';
      const reqUrl = new URL(req.url, baseURL);
      const queryUsername = reqUrl.searchParams.get("username");

      ws.username = queryUsername || animeProtagonists[Math.floor(Math.random() * animeProtagonists.length)];
      ws.color = colors[Math.floor(Math.random() * colors.length)];

      clients.add(ws);
      console.log(`${ws.username} ${ws.color("●")} connected (Total clients: ${clients.size})`);

      // Inform the user of their identity
      try {
        const styledWelcomeName = chalk.bgGray.white.bold(` ${ws.username} `);
        ws.send(`Welcome! You are ${styledWelcomeName} ${ws.color("●")}`);
      } catch (sendError) {
        console.error(chalk.red.bold(`✗ Error sending welcome message:`), sendError.message);
      }

      ws.on("message", (data) => {
        try {
          if (!data || data.length === 0) {
            console.warn(chalk.yellow(`⚠ Empty message received from ${ws.username}`));
            return;
          }
          sendMessages(data, ws);
        } catch (error) {
          console.error(chalk.red.bold(`✗ Error processing message from ${ws.username}:`), error.message);
          try {
            ws.send(chalk.red(`Error: Failed to process your message`));
          } catch (e) {
            // Silently fail if we can't send error message
          }
        }
      });

      ws.on("error", (error) => {
        console.error(chalk.red.bold(`✗ WebSocket error for ${ws.username}:`), error.message);
        // Clean up the client on error
        clients.delete(ws);
      });

      ws.on("close", (code, reason) => {
        clients.delete(ws);
        const reasonText = reason ? ` (Reason: ${reason})` : '';
        console.log(`${ws.username} ${chalk.red("●")} Disconnected${reasonText} (Total clients: ${clients.size})`);
      });
    } catch (error) {
      console.error(chalk.red.bold(`✗ Error handling new connection:`), error.message);
      try {
        ws.close(1011, "Server error during connection setup");
      } catch (e) {
        // Silently fail
      }
    }
  });

  // Handle WebSocket server errors
  wss.on("error", (error) => {
    console.error(chalk.red.bold(`✗ WebSocket Server error:`), error.message);
  });

  // Handle HTTP server errors
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(chalk.red.bold(`✗ Error: Port ${PORT} is already in use`));
      console.log(chalk.yellow(`⚠ Please try a different port or stop the process using port ${PORT}`));
    } else if (error.code === "EACCES") {
      console.error(chalk.red.bold(`✗ Error: Permission denied to use port ${PORT}`));
      console.log(chalk.yellow(`⚠ Try using a port number above 1024`));
    } else {
      console.error(chalk.red.bold(`✗ Server error:`), error.message);
    }
    process.exit(1);
  });

  const PORT = process.env.PORT || 8000;

  try {
    server.listen(PORT, () => {
      console.log(chalk.green.bold(`🟢 Server running on port ${PORT}`));
      console.log(chalk.yellow(`⚠ Press Ctrl+C to stop the server`));
    });
  } catch (error) {
    console.error(chalk.red.bold(`✗ Failed to start server:`), error.message);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log(`\n${chalk.yellow.bold("⚠ Shutting down server gracefully...")}`);

    // Close all client connections
    for (const client of clients) {
      try {
        client.close(1000, "Server shutting down");
      } catch (e) {
        // Silently fail
      }
    }

    // Close WebSocket server
    wss.close(() => {
      console.log(chalk.red(`✗ WebSocket server closed`));
    });

    // Close HTTP server
    server.close(() => {
      console.log(chalk.red(`✗ HTTP server closed`));
      process.exit(0);
    });

    // Force exit after 5 seconds if graceful shutdown fails
    setTimeout(() => {
      console.error(chalk.red.bold(`✗ Forced shutdown after timeout`));
      process.exit(1);
    }, 5000);
  });

  process.on("SIGTERM", () => {
    console.log(`\n${chalk.yellow.bold("⚠ SIGTERM received, shutting down...")}`);
    process.emit("SIGINT");
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error(chalk.red.bold(`✗ Uncaught Exception:`), error.message);
    console.error(chalk.red(error.stack));
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error(chalk.red.bold(`✗ Unhandled Rejection at:`), promise);
    console.error(chalk.red.bold(`Reason:`), reason);
  });
}
