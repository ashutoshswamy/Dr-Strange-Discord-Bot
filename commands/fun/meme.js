const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const res = await fetch('https://meme-api.com/gimme');
      const data = await res.json();

      if (!data || !data.url) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('Error')
          .setDescription('Failed to fetch meme.')
          .setTimestamp();
        return interaction.editReply({ embeds: [errorEmbed] });
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title || 'Random Meme')
        .setImage(data.url)
        .setFooter({
          text: `Upvotes: ${data.ups || 0} | r/${data.subreddit || 'memes'}`,
        })
        .setColor(0x00bfff);

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Meme portal collapsed. Try again.')
        .setTimestamp();
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
