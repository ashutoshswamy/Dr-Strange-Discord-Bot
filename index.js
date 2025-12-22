require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');

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
