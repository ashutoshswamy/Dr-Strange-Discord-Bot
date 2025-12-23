const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('portal')
    .setDescription('Open a portal to a random channel'),

  async execute(interaction) {
    const channels = interaction.guild.channels.cache.filter(
      c => c.isTextBased() && c.viewable
    );

    const channel = channels.random();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Portal Opened')
      .setDescription(`Portal opened to ${channel}`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
