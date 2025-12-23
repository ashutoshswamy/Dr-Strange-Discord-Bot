const { Schema, model } = require('mongoose');

const modLogSchema = new Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  action: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = model('ModLog', modLogSchema);
