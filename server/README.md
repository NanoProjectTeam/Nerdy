# 🤓 Nerdy Dedicated Backend Server (Wispbyte)

This is the standalone persistent backend and WebSocket server for **Nerdy** running on Wispbyte (`nerdy.freesrv.com:15371`).

### ✨ Capabilities:
1. **Persistent Message Storage**: Saves all messages across channels to `nerdy_db.json`.
2. **Real-time WebSockets**: Live broadcast of chat messages and emoji reactions.
3. **0-Auth / Instant Login**: Fast accounts with zero authentication friction.
4. **Channel & Server Management**: Create and list channels and servers.

---

## 🚀 How to Run on Wispbyte Panel

1. **Log in to your Wispbyte Client Panel** (`https://wispbyte.com`).
2. Go to your server instance.
3. In **Network / Allocation** tab, confirm your port is `15371` and your subdomain is `nerdy.freesrv.com`.
4. Open the **Files** manager tab or deploy via Git.
5. In your Wispbyte **Startup** tab:
   - **Main File**: `index.js`
   - **Startup Command**: `node index.js`
6. Start the server!
   You will see:
   ```
   ===============================================
   🤓 Nerdy Server is Running on port 15371
   📡 WebSocket URL: ws://0.0.0.0:15371
   🌐 Subdomain: nerdy.freesrv.com:15371
   💾 Database file: /home/container/nerdy_db.json
   ===============================================
   ```

---

## 💻 How to Run Locally

```bash
cd server
npm install
npm start
```
Server listens on `http://localhost:15371`.
