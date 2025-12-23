const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../services/guildConfigService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View bot settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = await getConfig(interaction.guild.id);

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Server Settings')
      .addFields(
        { name: 'Economy', value: config.economyEnabled ? 'Enabled' : 'Disabled', inline: true },
        { name: 'Tax', value: `${config.taxPercent}%`, inline: true },
        { name: 'Daily Limit', value: `${config.dailyLimit.toLocaleString()} ME`, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
