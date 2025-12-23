const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Inventory = require('../../models/Inventory');
const { isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your inventory'),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const inv = await Inventory.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    if (!inv || !inv.items.length) {
      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Inventory')
        .setDescription('Your inventory is empty.')
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Your Inventory')
      .setDescription(inv.items.join(', '))
      .setFooter({ text: interaction.user.username })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
