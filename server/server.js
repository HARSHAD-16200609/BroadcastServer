import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { animeProtagonists } from "../app/usernames.js";

export function startServer(port = 8080) {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });
  const clients = new Set();

  const colors = [
    "\x1b[31m", // Red
    "\x1b[32m", // Green
    "\x1b[33m", // Yellow
    "\x1b[34m", // Blue
    "\x1b[35m", // Magenta
    "\x1b[36m", // Cyan
  ];
  const resetColor = "\x1b[0m";
  const errorColor = "\x1b[91m"; // Bright red for errors
  const warningColor = "\x1b[93m"; // Bright yellow for warnings

  function sendMessages(data, ws) {
    try {
      const message = `${ws.username} ${ws.color}●${resetColor} : ${data.toString()}`;
      
      for (const client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          try {
            client.send(message);
          } catch (sendError) {
            console.error(`${errorColor}✗ Error sending message to client:${resetColor}`, sendError.message);
            // Don't remove client here, let the error/close handlers deal with it
          }
        }
      }
    } catch (error) {
      console.error(`${errorColor}✗ Error in sendMessages:${resetColor}`, error.message);
    }
  }

  wss.on("connection", (ws) => {
    try {
      ws.username = animeProtagonists[Math.floor(Math.random() * animeProtagonists.length)];
      ws.color = colors[Math.floor(Math.random() * colors.length)];
      
      clients.add(ws);
      console.log(`${ws.username} ${ws.color}●${resetColor} connected (Total clients: ${clients.size})`);
      
      // Inform the user of their identity
      try {
        ws.send(`Welcome! You are ${ws.username} ${ws.color}●${resetColor}`);
      } catch (sendError) {
        console.error(`${errorColor}✗ Error sending welcome message:${resetColor}`, sendError.message);
      }

      ws.on("message", (data) => {
        try {
          if (!data || data.length === 0) {
            console.warn(`${warningColor}⚠ Empty message received from ${ws.username}${resetColor}`);
            return;
          }
          sendMessages(data, ws);
        } catch (error) {
          console.error(`${errorColor}✗ Error processing message from ${ws.username}:${resetColor}`, error.message);
          try {
            ws.send(`${errorColor}Error: Failed to process your message${resetColor}`);
          } catch (e) {
            // Silently fail if we can't send error message
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`${errorColor}✗ WebSocket error for ${ws.username}:${resetColor}`, error.message);
        // Clean up the client on error
        clients.delete(ws);
      });

      ws.on("close", (code, reason) => {
        clients.delete(ws);
        const reasonText = reason ? ` (Reason: ${reason})` : '';
        console.log(`${ws.username} \x1b[31m●${resetColor} Disconnected${reasonText} (Total clients: ${clients.size})`);
      });
    } catch (error) {
      console.error(`${errorColor}✗ Error handling new connection:${resetColor}`, error.message);
      try {
        ws.close(1011, "Server error during connection setup");
      } catch (e) {
        // Silently fail
      }
    }
  });

  // Handle WebSocket server errors
  wss.on("error", (error) => {
    console.error(`${errorColor}✗ WebSocket Server error:${resetColor}`, error.message);
  });

  // Handle HTTP server errors
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`${errorColor}✗ Error: Port ${PORT} is already in use${resetColor}`);
      console.log(`${warningColor}⚠ Please try a different port or stop the process using port ${PORT}${resetColor}`);
    } else if (error.code === "EACCES") {
      console.error(`${errorColor}✗ Error: Permission denied to use port ${PORT}${resetColor}`);
      console.log(`${warningColor}⚠ Try using a port number above 1024${resetColor}`);
    } else {
      console.error(`${errorColor}✗ Server error:${resetColor}`, error.message);
    }
    process.exit(1);
  });

  const PORT = process.env.PORT || 8000;

  try {
    server.listen(PORT, () => {
      console.log(`🟢 Server running on port ${PORT}`);
      console.log(`${warningColor}⚠ Press Ctrl+C to stop the server${resetColor}`);
    });
  } catch (error) {
    console.error(`${errorColor}✗ Failed to start server:${resetColor}`, error.message);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log(`\n${warningColor}⚠ Shutting down server gracefully...${resetColor}`);
    
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
      console.log(`${errorColor}✗ WebSocket server closed${resetColor}`);
    });
    
    // Close HTTP server
    server.close(() => {
      console.log(`${errorColor}✗ HTTP server closed${resetColor}`);
      process.exit(0);
    });
    
    // Force exit after 5 seconds if graceful shutdown fails
    setTimeout(() => {
      console.error(`${errorColor}✗ Forced shutdown after timeout${resetColor}`);
      process.exit(1);
    }, 5000);
  });

  process.on("SIGTERM", () => {
    console.log(`\n${warningColor}⚠ SIGTERM received, shutting down...${resetColor}`);
    process.emit("SIGINT");
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error(`${errorColor}✗ Uncaught Exception:${resetColor}`, error.message);
    console.error(error.stack);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error(`${errorColor}✗ Unhandled Rejection at:${resetColor}`, promise);
    console.error(`${errorColor}Reason:${resetColor}`, reason);
  });
}
