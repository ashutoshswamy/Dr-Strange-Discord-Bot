const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const sendModLog = require('../../utils/sendModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(o =>
      o.setName('user').setDescription('User to warn').setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason').setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const embed = new EmbedBuilder()
      .setColor(0xF59E0B)
      .setTitle('User Warned')
      .addFields(
        { name: 'User', value: `${user.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await sendModLog(interaction.guild, {
      action: 'WARN',
      userId: user.id,
      moderatorId: interaction.user.id,
      reason,
    });
  },
};
