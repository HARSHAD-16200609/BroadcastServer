# 🎙️ Broadcast Server

A real-time WebSocket chat server with a beautiful web client interface.

## 🚀 Features

- Real-time messaging via WebSocket
- Random anime protagonist usernames
- Color-coded users
- Beautiful, responsive web interface
- Works on any device with a browser
- No installation required for clients

## 📦 Installation

### For Users (Recommended)

Install globally via npm to use the CLI anywhere:

```bash
npm install -g broadcast-server-cli
```

After installation, you can use the `broadcast-server` command from anywhere!

### For Developers

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/broadcast-server.git
cd broadcast-server
npm install
```

## 🎯 Usage

### Starting the Server

**If installed globally via npm:**
```bash
broadcast-server start
```

**If running locally (for developers):**
```bash
npm start
# or
node cli/cli.js start
```

The server will start on port 8080 (or the PORT environment variable if set).

**On Render (or other platforms):**
The server automatically uses the `PORT` environment variable provided by the hosting platform.

### Connecting to the Server

#### Option 1: Web Browser (Recommended) ✨

Simply open your browser and navigate to:
- **Local:** `http://localhost:8080`
- **Deployed:** `https://broadcastserver.onrender.com`

The web interface will load automatically. Click "Connect" to join the chat!

#### Option 2: CLI Client (For Developers)

**If installed globally:**
```bash
broadcast-server connect wss://broadcastserver.onrender.com
```

**If running locally:**
```bash
node cli/cli.js connect wss://broadcastserver.onrender.com
# or for local server
node cli/cli.js connect ws://localhost:8080
```

## 🌐 Deployment

### Render.com

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Render will automatically detect the build and start commands from `package.json`
5. Your service will be available at `https://your-service-name.onrender.com`

**Important:** The web client will be accessible at the root URL (`https://your-service-name.onrender.com`), and the WebSocket server runs on the same URL with the `wss://` protocol.

## 📱 Sharing with Others

To let others join your chat:

1. **If deployed on Render:** Share the URL `https://broadcastserver.onrender.com`
2. **If running locally:** 
   - Find your local IP address (e.g., `192.168.1.100`)
   - Share `http://YOUR_IP:8080` with people on the same network
   - They can open it in any browser (phone, tablet, computer)

## 🎨 Features of the Web Client

- **Modern UI:** Beautiful gradient design with smooth animations
- **Real-time Status:** See connection status at a glance
- **User Identity:** Each user gets a unique anime protagonist name and color
- **Message History:** Scroll through previous messages
- **Responsive:** Works on desktop, tablet, and mobile
- **No Installation:** Just open in a browser!

## 🛠️ Technical Details

- **Backend:** Node.js with `ws` WebSocket library
- **Frontend:** Pure HTML/CSS/JavaScript (no frameworks needed)
- **Protocol:** WebSocket (ws:// for local, wss:// for production)
- **Port:** Configurable via environment variable or defaults to 8080

## 📝 Commands

- **Start server:** `npm start` or `node cli/cli.js start`
- **Connect via CLI:** `node cli/cli.js connect <websocket-url>`
- **Exit CLI client:** Type `/exit`

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure the server is running
- Check that you're using the correct protocol (`ws://` for local, `wss://` for deployed)
- Verify the URL is correct

### "broadcast-server command not found"
- Use `node cli/cli.js` instead of `broadcast-server`
- Or install globally: `npm install -g .` (from the project directory)

### Web client not loading
- Ensure the `public/index.html` file exists
- Check server logs for errors
- Try accessing `/index.html` explicitly

## 📄 License

MIT
