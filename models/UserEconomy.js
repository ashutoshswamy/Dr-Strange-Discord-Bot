const { Schema, model } = require('mongoose');

const userEconomySchema = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },

  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },

  job: { type: String, default: null },
  jobHistory: { type: [String], default: [] },
  lastWork: { type: Date, default: null },

  lastDaily: { type: Date, default: null },
  lastWeekly: { type: Date, default: null },

  dailyStreak: { type: Number, default: 0 },

}, { timestamps: true });

userEconomySchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model('UserEconomy', userEconomySchema);
