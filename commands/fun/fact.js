const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fact')
    .setDescription('Get a random interesting fact'),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const res = await fetch(
        'https://uselessfacts.jsph.pl/random.json?language=en'
      );
      const data = await res.json();

      if (!data || !data.text) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('Error')
          .setDescription('Failed to fetch a fact.')
          .setTimestamp();
        return interaction.editReply({ embeds: [errorEmbed] });
      }

      const embed = new EmbedBuilder()
        .setTitle('Random Fact')
        .setDescription(data.text)
        .setColor(0x6a0dad)
        .setFooter({ text: 'Powered by uselessfacts.jsph.pl' });

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('The Book of Vishanti is unreadable right now.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
