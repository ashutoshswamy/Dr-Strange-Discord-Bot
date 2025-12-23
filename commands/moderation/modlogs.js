const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ModLog = require('../../models/ModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modlogs')
    .setDescription('View moderation logs')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const logs = await ModLog.find({ guildId: interaction.guild.id })
      .sort({ timestamp: -1 })
      .limit(10);

    if (!logs.length) {
      const embed = new EmbedBuilder()
        .setColor(0x1F2937)
        .setTitle('Moderation Logs')
        .setDescription('No moderation logs found.')
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setTitle('Moderation Logs')
      .setColor(0x1F2937)
      .setDescription(
        logs
          .map(
            l =>
              `**${l.action}** — <@${l.userId}>\nModerator: <@${l.moderatorId}>\nReason: ${l.reason}`
          )
          .join('\n\n')
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
