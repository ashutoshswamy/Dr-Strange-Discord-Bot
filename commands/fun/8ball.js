const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const responses = [
  'Yes', 'No', 'Maybe', 'Definitely', 'Ask again later',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball')
    .addStringOption(o =>
      o.setName('question').setDescription('Your question').setRequired(true)
    ),

  execute(interaction) {
    const question = interaction.options.getString('question');
    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Magic 8 Ball')
      .addFields(
        { name: 'Question', value: question },
        { name: 'Answer', value: `**${answer}**` }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
