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
     
    startClient(url);
    break;

  default:
    console.log(`
Usage:
  broadcast-server start (to start the server)
  broadcast-server connect (to connect to server)
`);
}
