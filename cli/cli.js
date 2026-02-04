#!/usr/bin/env node

import { startServer } from "../server/server.js";
import { startClient } from "../app/app.js";

const args = process.argv.slice(2);


const command = args[0];
const port = args[1] || process.env.PORT || 8080;

switch (command) {
  case "start":
    startServer(port);
    break;

  case "connect":
     // If the second argument is a full URL (starts with ws:// or wss://), use it.
     // Otherwise, assume it's a port or default to localhost:8080
    let url = args[1];
    if (!url) {
      url = "ws://localhost:8080";
    } else if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
        // Assume it's just a port number if it looks like one, otherwise maybe a host?
        // For simplicity, if it's a number, assume localhost:port.
        // If the user wants a remote host, they should provide the full URL.
        if (!isNaN(url)) {
            url = `ws://localhost:${url}`;
        }
        // If it's not a number, maybe they typed 'google.com', but let's stick to full URLs for clarity or port numbers.
    }
    startClient(url);
    break;

  default:
    console.log(`
Usage:
  broadcast-server start (to start the server)
  broadcast-server connect (to connect to server)
`);
}
