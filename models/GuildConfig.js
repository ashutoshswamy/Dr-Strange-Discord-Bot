const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },

  economyEnabled: { type: Boolean, default: true },
  taxPercent: { type: Number, default: 0 }, // %
  dailyLimit: { type: Number, default: 10000 },
});

module.exports = model('GuildConfig', guildConfigSchema);
