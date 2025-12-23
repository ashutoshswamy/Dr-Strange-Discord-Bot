const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot and API latency'),

  async execute(interaction, client) {
    const sent = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x1E4ED8)
          .setTitle('Checking Latency')
          .setDescription('Measuring connection...')
      ],
      fetchReply: true,
    });

    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Multiverse Status')
      .addFields(
        { name: 'Bot Latency', value: `${botLatency}ms`, inline: true },
        { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
      )
      .setFooter({ text: 'All timelines are stable.' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
