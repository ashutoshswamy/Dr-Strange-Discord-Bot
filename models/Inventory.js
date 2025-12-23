const { Schema, model } = require('mongoose');

const inventorySchema = new Schema({
  userId: String,
  guildId: String,
  items: [String],
});

module.exports = model('Inventory', inventorySchema);
