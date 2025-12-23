const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Roast someone')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to roast')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user');

    try {
      const res = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json');
      const data = await res.json();

      if (!data || !data.insult) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('Error')
          .setDescription('Failed to fetch roast.')
          .setTimestamp();
        return interaction.editReply({ embeds: [errorEmbed] });
      }

      const embed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Roast')
        .setDescription(`${user}, ${data.insult}`)
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Failed to fetch roast.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
