const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Get word meaning')
    .addStringOption(o =>
      o.setName('word')
        .setDescription('Word to define')
        .setRequired(true)
    ),

  async execute(interaction) {
    const word = interaction.options.getString('word');

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await res.json();

    if (!Array.isArray(data)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Word not found.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const meaning = data[0].meanings[0].definitions[0].definition;

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle(`Definition: ${word}`)
      .setDescription(meaning)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
