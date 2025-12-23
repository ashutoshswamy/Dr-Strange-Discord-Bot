# Dr Strange Discord Bot

A feature-rich Discord bot themed around Doctor Strange and the Marvel Mystic Arts universe. Built with Discord.js v14 and MongoDB, featuring AI-powered commands, a complete economy system, moderation tools, and fun interactive commands.

![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Node.js](https://img.shields.io/badge/node.js-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-purple)

---

## Features

### AI Commands
Powered by Google Gemini AI for intelligent interactions:
- `/ask` - Ask Dr Strange any question
- `/explain` - Get explanations on any topic
- `/rewrite` - Rewrite text in different styles
- `/summarize` - Summarize long text

### Economy System
A complete Multiverse Energy (ME) economy with Doctor Strange theming:
- **Currency**: Earn and spend Multiverse Energy
- **Banking**: Deposit and withdraw from your bank
- **Jobs**: Progress through mystical career paths (Apprentice → Sanctum Master)
- **Shop**: Purchase mystical artifacts like Sling Ring, Eye of Agamotto, Cloak of Levitation
- **Gambling**: Coinflip, Dice, Slots, Blackjack, and Betting
- **Social**: Gift items, give money, and rob other users
- **Leaderboard**: Track the wealthiest sorcerers

### Moderation
Comprehensive server management tools:
- `/ban` `/kick` - Remove troublesome users
- `/mute` `/unmute` - Manage user messaging permissions
- `/timeout` - Temporarily restrict users
- `/warn` `/warnings` - Warning system with logging
- `/purge` - Bulk delete messages
- `/slowmode` - Set channel slowmode
- `/lock` `/unlock` - Channel lock controls
- `/modlogs` - View moderation history

### Admin Commands
Server configuration and management:
- `/setup` - Initial bot configuration
- `/toggle` - Enable/disable bot features
- `/settings` - View current server settings
- `/statsserver` - Comprehensive server statistics
- `/economy-tax` - Configure economy tax rates
- `/economy-limits` - Set daily earning limits
- `/addbalance` `/removebalance` `/setbalance` - Manage user balances
- `/reseteconomy` - Reset economy data
- `/auditeconomy` - View economy audit logs

### Fun Commands
Entertainment with a mystical twist:
- `/8ball` - Ask the magic 8-ball
- `/portal` - Open a mystical portal
- `/spell` - Cast a random spell
- `/meme` - Get random memes
- `/fact` - Random interesting facts
- `/quote` - Inspirational quotes
- `/roast` - Playful roasts
- `/compliment` - Kind compliments

### Utility Commands
Helpful everyday commands:
- `/help` - View all commands by category
- `/ping` - Check bot latency
- `/poll` - Create polls
- `/reminder` - Set reminders
- `/time` - World time zones
- `/weather` - Weather information
- `/translate` - Text translation
- `/define` - Dictionary lookup

---

## Installation

### Prerequisites
- **Node.js** 18.0 or higher
- **MongoDB** database
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)
- **Google Gemini API Key** for AI features

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashutoshswamy/Dr-Strange-Discord-Bot.git
   cd Dr-Strange-Discord-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   CLIENT_ID=your_discord_application_client_id
   GUILD_ID=your_development_guild_id
   ```

4. **Start the bot**
   ```bash
   node index.js
   ```

---

## Project Structure

```
dr-strange/
├── commands/              # Slash commands organized by category
│   ├── admin/             # Server administration commands
│   ├── ai/                # AI-powered commands (Gemini)
│   ├── economy/           # Economy system commands
│   ├── fun/               # Entertainment commands
│   ├── moderation/        # Moderation tools
│   └── utility/           # Utility commands
├── data/                  # Static data files
│   ├── jobs.js            # Job definitions and requirements
│   └── shop.js            # Shop items and prices
├── events/                # Discord event handlers
├── handlers/              # Command and event loaders
├── models/                # MongoDB schemas
│   ├── GuildConfig.js     # Server configuration
│   ├── Inventory.js       # User inventories
│   ├── ModLog.js          # Moderation logs
│   └── UserEconomy.js     # User economy data
├── services/              # Business logic services
│   ├── economyService.js  # Economy operations
│   ├── geminiService.js   # Gemini AI integration
│   └── guildConfigService.js
├── utils/                 # Utility functions
├── index.js               # Main entry point
└── package.json
```

---

## Economy System Details

### Jobs Hierarchy
Progress through mystical careers at Kamar-Taj:

| Tier | Job | Pay | Requirement |
|------|-----|-----|-------------|
| Entry | Apprentice | 100 ME | None |
| Basic | Sorcerer | 200 ME | Worked as Apprentice |
| Basic | Archivist | 150 ME | 500 ME balance |
| Basic | Librarian | 180 ME | Worked as Archivist |
| Basic | Herbalist | 170 ME | 300 ME balance |
| Mid | Guardian | 300 ME | Worked as Sorcerer |
| Mid | Enchanter | 250 ME | 1,000 ME balance |
| Mid | Portalkeeper | 220 ME | Worked as Sorcerer |
| Mid | Runesmith | 230 ME | Worked as Enchanter |
| Advanced | Relicmaster | 350 ME | 2,500 ME balance |
| Advanced | Astral Scout | 280 ME | Worked as Guardian |
| Advanced | Timewatcher | 320 ME | 3,000 ME balance |
| Expert | Dimensionnaut | 400 ME | Worked as Astral Scout |
| Expert | Voidhunter | 450 ME | 5,000 ME balance |
| Elite | Sanctum Master | 500 ME | Worked as Dimensionnaut |

### Featured Shop Items
- **Sling Ring** - 2,500 ME - Open portals to anywhere
- **Eye of Agamotto** - 10,000 ME - The Time Stone container
- **Cloak of Levitation** - 8,000 ME - Sentient flight cloak
- **Book of Darkhold** - 15,000 ME - Forbidden knowledge
- **Infinity Stone** - 50,000 ME - Rare collectible

---

## Configuration

### Guild Settings
Each server can customize:
- **Economy Enabled**: Toggle the economy system on/off
- **Tax Percent**: Set transaction tax (0-100%)
- **Daily Limit**: Maximum daily earnings cap

Use `/setup` for initial configuration and `/toggle` to enable/disable features.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| discord.js | ^14.25.1 | Discord API wrapper |
| mongoose | ^9.0.2 | MongoDB ODM |
| @google/generative-ai | ^0.24.1 | Gemini AI integration |
| dotenv | ^17.2.3 | Environment variables |
| node-fetch | ^3.3.2 | HTTP requests |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Ashutosh Swamy**

- GitHub: [@ashutoshswamy](https://github.com/ashutoshswamy)
- Repository: [Dr-Strange-Discord-Bot](https://github.com/ashutoshswamy/Dr-Strange-Discord-Bot)

---

## Acknowledgments

- Inspired by Doctor Strange and the Marvel Cinematic Universe
- Built with [Discord.js](https://discord.js.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)
