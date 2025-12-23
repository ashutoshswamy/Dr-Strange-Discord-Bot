const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const sendModLog = require('../../utils/sendModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(o =>
      o.setName('user').setDescription('User to kick').setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason').setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member || !member.kickable) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xDC2626)
        .setTitle('Error')
        .setDescription('Cannot kick this user.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0xDC2626)
      .setTitle('User Kicked')
      .addFields(
        { name: 'User', value: `${member.user.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await sendModLog(interaction.guild, {
      action: 'KICK',
      userId: member.id,
      moderatorId: interaction.user.id,
      reason,
    });
  },
};
