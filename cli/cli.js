#!/usr/bin/env node

import { startServer } from "../server/server.js";
import { startClient } from "../app/app.js";

const args = process.argv.slice(2);


const command = args[0];
const url = args[1] || process.env.PORT || 8080;

switch (command) {
  case "start":
    startServer(url);
    break;

  case "connect":
     // If the second argument is a full URL (starts with ws:// or wss://), use it.
     // Otherwise, assume it's a port or default to localhost:8080
    let url = args[1];
    if (!url) {
      url = "ws://localhost:8080";
    } else if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
  
        if (!isNaN(url)) {
            url = `${url}`;
        }
       
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
