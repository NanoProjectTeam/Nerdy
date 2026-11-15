const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 15371;
const DB_FILE = path.join(__dirname, 'nerdy_db.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Persistent File Database Helper
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: {},
      channels: [
        { id: 'c-general', name: 'general', type: 'text', topic: 'Main lobby for chatting with real-time end-to-end encryption.' },
        { id: 'c-v-general', name: '🔊 General Voice', type: 'voice', topic: 'Voice hangout with 4K screen share' },
      ],
      servers: [
        {
          id: 'server-nerdy-hq',
          name: 'Nerdy Official HQ',
          icon: '/mascot.png',
          boostTier: 3,
          boostCount: 42,
        },
      ],
      messages: {
        'c-general': [
          {
            id: 'msg-init-1',
            channelId: 'c-general',
            author: {
              id: 'nerd-founder',
              username: 'nerd_master',
              displayName: 'Nerdy Master 🤓',
              avatar: '/mascot.png',
              badges: [{ id: 'founder', name: 'Founder', icon: '👑' }],
            },
            content: 'Um, actually... welcome to the dedicated **Nerdy** server backend! All messages are encrypted, stored persistently, and broadcast in real-time. 🚀',
            timestamp: 'System',
            reactions: [{ emoji: '🤓', count: 1, users: ['nerd-founder'] }],
          },
        ],
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading database file, recovering:', err);
    return { users: {}, channels: [], servers: [], messages: {} };
  }
}

let db = initDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to database:', err);
  }
}

// REST Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Nerdy Backend Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    totalChannels: db.channels.length,
    activeConnections: wss.clients.size,
  });
});

// Authentication (0-Auth and Standard)
app.post('/api/auth/login', (req, res) => {
  const { username, displayName, email } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanUsername = username.toLowerCase().replace(/\s+/g, '_');
  let user = db.users[cleanUsername];

  if (!user) {
    user = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: cleanUsername,
      discriminator: String(Math.floor(1000 + Math.random() * 9000)),
      displayName: displayName || username,
      avatar: '/mascot.png',
      status: 'online',
      nitroLevel: 'Nerdy Nitro Supreme',
      createdAt: new Date().toISOString(),
    };
    db.users[cleanUsername] = user;
    saveDatabase();
  }

  res.json({ success: true, user });
});

// Get Messages for a Channel
app.get('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const channelMsgs = db.messages[channelId] || [];
  res.json({ channelId, messages: channelMsgs });
});

// Post a Message (Saves & Broadcasts)
app.post('/api/messages', (req, res) => {
  const { channelId, message } = req.body;
  if (!channelId || !message) {
    return res.status(400).json({ error: 'Missing channelId or message object' });
  }

  if (!db.messages[channelId]) {
    db.messages[channelId] = [];
  }

  const savedMessage = {
    ...message,
    id: message.id || `msg-${Date.now()}`,
    timestamp: message.timestamp || 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  db.messages[channelId].push(savedMessage);
  saveDatabase();

  // Broadcast to all active WebSocket clients
  broadcast({
    type: 'NEW_MESSAGE',
    channelId,
    message: savedMessage,
  });

  res.json({ success: true, message: savedMessage });
});

// Reaction Updates
app.post('/api/messages/:channelId/:messageId/reactions', (req, res) => {
  const { channelId, messageId } = req.params;
  const { emoji, userId } = req.body;

  const msgs = db.messages[channelId] || [];
  const msg = msgs.find((m) => m.id === messageId);
  if (!msg) {
    return res.status(404).json({ error: 'Message not found' });
  }

  if (!msg.reactions) msg.reactions = [];
  const existing = msg.reactions.find((r) => r.emoji === emoji);

  if (existing) {
    const userHas = existing.users.includes(userId);
    existing.users = userHas ? existing.users.filter((id) => id !== userId) : [...existing.users, userId];
    existing.count = existing.users.length;
    msg.reactions = msg.reactions.filter((r) => r.count > 0);
  } else {
    msg.reactions.push({ emoji, count: 1, users: [userId] });
  }

  saveDatabase();

  broadcast({
    type: 'REACTION_UPDATE',
    channelId,
    messageId,
    reactions: msg.reactions,
  });

  res.json({ success: true, reactions: msg.reactions });
});

// Channels API
app.get('/api/channels', (req, res) => {
  res.json(db.channels);
});

app.post('/api/channels', (req, res) => {
  const { name, type, topic } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const newChannel = {
    id: `c-${Date.now()}`,
    name: name.toLowerCase().replace(/\s+/g, '-'),
    type: type || 'text',
    topic: topic || '',
  };

  db.channels.push(newChannel);
  saveDatabase();

  broadcast({ type: 'NEW_CHANNEL', channel: newChannel });
  res.json({ success: true, channel: newChannel });
});

// Create HTTP Server & WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('⚡ New client connected to Nerdy WebSocket');

  ws.send(
    JSON.stringify({
      type: 'INIT',
      message: 'Connected to Nerdy Real-Time Server',
    })
  );

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch (e) {
      // ignore
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🤓 Nerdy Server is Running on port ${PORT}`);
  console.log(`📡 WebSocket URL: ws://0.0.0.0:${PORT}`);
  console.log(`💾 Database file: ${DB_FILE}`);
  console.log(`===============================================`);
});
