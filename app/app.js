import WebSocket from "ws";
import readline from "readline";

const errorColor = "\x1b[91m"; // Bright red for errors
const warningColor = "\x1b[93m"; // Bright yellow for warnings
const resetColor = "\x1b[0m";
const successColor = "\x1b[92m"; // Bright green for success

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

    console.log(`${warningColor}⚠ Connecting to ${wsUrl}...${resetColor}`);
    
    ws = new WebSocket(wsUrl);

    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!isConnected) {
        console.error(`${errorColor}✗ Connection timeout - Could not connect to server${resetColor}`);
        console.log(`${warningColor}⚠ Please check if the server is running and the URL is correct${resetColor}`);
        process.exit(1);
      }
    }, 10000); // 10 second timeout

    ws.on("open", () => {
      clearTimeout(connectionTimeout);
      isConnected = true;
      console.log(`${successColor}🟢 Connected to server${resetColor}`);
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
              console.log(`${warningColor}⚠ Disconnecting...${resetColor}`);
              isClosing = true;
              rl.close();
              ws.close(1000, "User requested disconnect");
              return;
            }

            if (!input || input.trim().length === 0) {
              console.warn(`${warningColor}⚠ Cannot send empty message${resetColor}`);
              return;
            }

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(input);
            } else {
              console.error(`${errorColor}✗ Cannot send message - Not connected to server${resetColor}`);
            }
          } catch (error) {
            console.error(`${errorColor}✗ Error sending message:${resetColor}`, error.message);
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
        console.error(`${errorColor}✗ Error setting up readline interface:${resetColor}`, error.message);
        ws.close();
        process.exit(1);
      }
    });

    ws.on("message", (msg) => {
      try {
        console.log(msg.toString());
      } catch (error) {
        console.error(`${errorColor}✗ Error displaying message:${resetColor}`, error.message);
      }
    });

    ws.on("error", (error) => {
      if (error.code === "ECONNREFUSED") {
        console.error(`${errorColor}✗ Connection refused - Server is not running or unreachable${resetColor}`);
        console.log(`${warningColor}⚠ Please check:${resetColor}`);
        console.log(`  1. Server is running`);
        console.log(`  2. URL is correct: ${wsUrl}`);
        console.log(`  3. No firewall blocking the connection`);
      } else if (error.code === "ENOTFOUND") {
        console.error(`${errorColor}✗ Host not found - Invalid URL${resetColor}`);
        console.log(`${warningColor}⚠ Please check the server URL: ${wsUrl}${resetColor}`);
      } else if (error.code === "ETIMEDOUT") {
        console.error(`${errorColor}✗ Connection timed out${resetColor}`);
        console.log(`${warningColor}⚠ Server is not responding${resetColor}`);
      } else {
        console.error(`${errorColor}✗ WebSocket error:${resetColor}`, error.message);
      }
      
      if (!isConnected) {
        process.exit(1);
      }
    });

    ws.on("close", (code, reason) => {
      isConnected = false;
      const reasonText = reason ? ` (Reason: ${reason})` : '';
      
      if (isClosing) {
        console.log(`${successColor}🔴 Disconnected from server${reasonText}${resetColor}`);
      } else {
        console.log(`${errorColor}🔴 Connection lost${reasonText}${resetColor}`);
        
        // Provide helpful messages based on close code
        if (code === 1006) {
          console.log(`${warningColor}⚠ Abnormal closure - Server may have crashed or network issue${resetColor}`);
        } else if (code === 1011) {
          console.log(`${warningColor}⚠ Server encountered an error${resetColor}`);
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
      console.log(`\n${warningColor}⚠ Interrupted - Disconnecting...${resetColor}`);
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
      console.log(`\n${warningColor}⚠ SIGTERM received - Disconnecting...${resetColor}`);
      process.emit("SIGINT");
    });

  } catch (error) {
    console.error(`${errorColor}✗ Failed to start client:${resetColor}`, error.message);
    console.log(`${warningColor}⚠ Usage: broadcast-server connect <ws://server-url:port>${resetColor}`);
    process.exit(1);
  }
}
