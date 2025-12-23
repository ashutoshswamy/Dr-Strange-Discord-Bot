const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const sendModLog = require('../../utils/sendModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(o =>
      o.setName('user').setDescription('User to ban').setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason').setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member || !member.bannable) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x7F1D1D)
        .setTitle('Error')
        .setDescription('Cannot ban this user.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor(0x7F1D1D)
      .setTitle('User Banned')
      .addFields(
        { name: 'User', value: `${member.user.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await sendModLog(interaction.guild, {
      action: 'BAN',
      userId: member.id,
      moderatorId: interaction.user.id,
      reason,
    });
  },
};
