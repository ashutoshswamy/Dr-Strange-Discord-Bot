const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Inventory = require('../../models/Inventory');
const { isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift an item to another user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('item').setDescription('Item').setRequired(true)),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const user = interaction.options.getUser('user');
    const item = interaction.options.getString('item').toLowerCase();

    const senderInv = await Inventory.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

    if (!senderInv || !senderInv.items.includes(item)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Item Not Found')
        .setDescription('You do not own this item.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    senderInv.items = senderInv.items.filter(i => i !== item);
    await senderInv.save();

    await Inventory.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guild.id },
      { $push: { items: item } },
      { upsert: true }
    );

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Gift Sent')
      .setDescription(`You gifted **${item}** to **${user.tag}**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
