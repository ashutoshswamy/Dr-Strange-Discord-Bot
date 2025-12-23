const GuildConfig = require('../models/GuildConfig');

async function getConfig(guildId) {
  let config = await GuildConfig.findOne({ guildId });
  if (!config) config = await GuildConfig.create({ guildId });
  return config;
}

module.exports = { getConfig };
