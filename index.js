require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const http = require('http');

const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

client.commands = new Collection();

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🗄️ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* Load Handlers */
commandHandler(client);
eventHandler(client);

/* Login */
client.login(process.env.DISCORD_TOKEN);

/* Health Check Server for Render */
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      bot: client.user ? client.user.tag : 'Starting...',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Health check server running on port ${PORT}`);
});
