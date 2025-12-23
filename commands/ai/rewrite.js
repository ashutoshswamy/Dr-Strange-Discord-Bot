const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generate } = require('../../services/geminiService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rewrite')
    .setDescription('Rewrite text in a different tone')
    .addStringOption(o =>
      o.setName('text')
        .setDescription('Text to rewrite')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('style')
        .setDescription('Rewrite style')
        .setRequired(true)
        .addChoices(
          { name: 'Formal', value: 'formal' },
          { name: 'Casual', value: 'casual' },
          { name: 'Short', value: 'short' },
          { name: 'Professional', value: 'professional' }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const text = interaction.options.getString('text');
    const style = interaction.options.getString('style');

    const prompt = `
Rewrite the following text in a ${style} tone:

${text}
`;

    try {
      const rewritten = await generate(prompt);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Text Rewritten')
        .addFields(
          { name: 'Original', value: text.slice(0, 1024) },
          { name: `Rewritten (${style})`, value: rewritten.slice(0, 1024) }
        )
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Rewrite failed.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
