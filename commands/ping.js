const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot and API latency'),

  async execute(interaction, client) {
    const sent = await interaction.reply({
      content: '🔮 Checking timelines...',
      fetchReply: true,
    });

    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    await interaction.editReply({
      content: 
        `🧙‍♂️ **Dr Strange – Multiverse Status**\n\n` +
        `🏓 Bot Latency: **${botLatency}ms**\n` +
        `🌐 API Latency: **${apiLatency}ms**\n\n` +
        `“All timelines are stable.”`
    });
  },
};
