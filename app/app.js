import WebSocket from "ws";
import readline from "readline";

export function startClient(url) {
  console.log(url);
  
  const ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("🟢 Connected to server");
    console.log("Type messages. Use /exit to quit.\n");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on("line", (input) => {
      if (input === "/exit") {
        rl.close();
        ws.close();
        process.exit(0);
      }

      ws.send(input);
    });
  });

  ws.on("message", (msg) => {
    console.log(msg.toString());
  });

  ws.on("close", () => {
    console.log("🔴 Disconnected from server");
    process.exit(0);
  });
}
