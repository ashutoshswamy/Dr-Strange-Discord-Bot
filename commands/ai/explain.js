const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generate } = require('../../services/geminiService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('explain')
    .setDescription('Explain code, errors, or concepts')
    .addStringOption(o =>
      o.setName('input')
        .setDescription('Code, error, or topic to explain')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const input = interaction.options.getString('input');

    const prompt = `
Explain the following in a simple and beginner-friendly way:

${input}
`;

    try {
      const explanation = await generate(prompt);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Explanation')
        .addFields(
          { name: 'Input', value: input.slice(0, 1024) },
          { name: 'Explanation', value: explanation.slice(0, 1024) }
        )
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Explanation failed.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
