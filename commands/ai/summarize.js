const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generate } = require('../../services/geminiService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('Summarize long messages or text')
    .addStringOption(o =>
      o.setName('text')
        .setDescription('Text to summarize')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const text = interaction.options.getString('text');

    const prompt = `
Summarize the following text clearly in bullet points:

${text}
`;

    try {
      const summary = await generate(prompt);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Summary')
        .setDescription(summary.slice(0, 4096))
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Failed to summarize.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
