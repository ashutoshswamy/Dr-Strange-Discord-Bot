const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const quotes = [
  '"I\'ve seen 14,000,605 futures."',
  '"The bill comes due. Always."',
  '"We never lose our demons, Mordo."',
  '"This is the only way."',
  '"You think you know how the world works?"',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a Dr Strange quote'),

  execute(interaction) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Dr Strange Quote')
      .setDescription(quote)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
