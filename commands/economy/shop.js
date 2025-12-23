const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shop = require('../../data/shop');
const { isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View shop items'),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const items = Object.entries(shop)
      .map(([k, v]) => `**${k}** — ${v.price.toLocaleString()} ME\n> ${v.description}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Multiverse Shop')
      .setDescription(items || 'No items available')
      .setFooter({ text: 'Use /buy <item> to purchase' })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
