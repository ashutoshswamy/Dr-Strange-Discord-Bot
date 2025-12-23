const UserEconomy = require('../models/UserEconomy');
const { getConfig } = require('./guildConfigService');
const { EmbedBuilder } = require('discord.js');

async function getUser(userId, guildId) {
  let user = await UserEconomy.findOne({ userId, guildId });
  if (!user) {
    user = await UserEconomy.create({ userId, guildId });
  }
  return user;
}

async function addBalance(userId, guildId, amount) {
  const user = await getUser(userId, guildId);
  user.balance += amount;
  await user.save();
  return user.balance;
}

async function removeBalance(userId, guildId, amount) {
  const user = await getUser(userId, guildId);
  user.balance = Math.max(0, user.balance - amount);
  await user.save();
  return user.balance;
}

// Check if economy is enabled for a guild
async function isEconomyEnabled(guildId) {
  const config = await getConfig(guildId);
  return config.economyEnabled;
}

// Get the configured tax percentage
async function getTaxPercent(guildId) {
  const config = await getConfig(guildId);
  return config.taxPercent || 0;
}

// Apply tax to an amount and return { net, tax }
async function applyTax(guildId, amount) {
  const taxPercent = await getTaxPercent(guildId);
  const tax = Math.floor(amount * (taxPercent / 100));
  return { net: amount - tax, tax };
}

// Check if economy is enabled, returns embed if disabled
function economyDisabledEmbed() {
  return new EmbedBuilder()
    .setColor(0xDC2626)
    .setTitle('Economy Disabled')
    .setDescription('The economy system is currently disabled on this server.')
    .setTimestamp();
}

module.exports = {
  getUser,
  addBalance,
  removeBalance,
  isEconomyEnabled,
  getTaxPercent,
  applyTax,
  economyDisabledEmbed,
};
