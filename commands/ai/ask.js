const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generate } = require('../../services/geminiService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask Dr Strange any question')
    .addStringOption(o =>
      o.setName('question')
        .setDescription('Your question')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');

    const prompt = `
You are Dr Strange, a calm, intelligent assistant.
Answer clearly and concisely.

Question:
${question}
`;

    try {
      const answer = await generate(prompt);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Dr Strange')
        .addFields(
          { name: 'Question', value: question },
          { name: 'Answer', value: answer.slice(0, 1024) }
        )
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('The multiverse is unstable. Try again.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
