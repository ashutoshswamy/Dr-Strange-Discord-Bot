const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shop = require('../../data/shop');
const Inventory = require('../../models/Inventory');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item')
    .addStringOption(o =>
      o.setName('item').setDescription('Item name').setRequired(true)
    ),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const item = interaction.options.getString('item').toLowerCase();

    if (!shop[item]) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Item Not Found')
        .setDescription('This item does not exist in the shop.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);

    if (user.balance < shop[item].price) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Insufficient Funds')
        .setDescription('You do not have enough Multiverse Energy.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    user.balance -= shop[item].price;
    await user.save();

    await Inventory.findOneAndUpdate(
      { userId: user.userId, guildId: user.guildId },
      { $push: { items: item } },
      { upsert: true, new: true }
    );

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Purchase Successful')
      .setDescription(`You purchased **${item}** for **${shop[item].price.toLocaleString()}** ME`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
