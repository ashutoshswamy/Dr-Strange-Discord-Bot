const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ensureMutedRole = require('../../utils/ensureMutedRole');
const sendModLog = require('../../utils/sendModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user (role-based)')
    .addUserOption(o =>
      o.setName('user').setDescription('User to mute').setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason').setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Member not found.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const mutedRole = await ensureMutedRole(interaction.guild);

    if (member.roles.cache.has(mutedRole.id)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('User is already muted.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    await member.roles.add(mutedRole, reason);

    const embed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle('User Muted')
      .addFields(
        { name: 'User', value: `${member.user.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await sendModLog(interaction.guild, {
      action: 'MUTE',
      userId: member.id,
      moderatorId: interaction.user.id,
      reason,
    });
  },
};
