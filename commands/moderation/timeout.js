const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const sendModLog = require('../../utils/sendModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(o =>
      o.setName('user').setDescription('User').setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('minutes')
        .setDescription('Timeout duration')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason').setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason') || 'No reason';

    if (!member.moderatable) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Cannot timeout this user.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    await member.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle('User Timed Out')
      .addFields(
        { name: 'User', value: `${member.user.tag}`, inline: true },
        { name: 'Duration', value: `${minutes.toLocaleString()} minutes`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

    sendModLog(interaction.guild, {
      action: 'TIMEOUT',
      userId: member.id,
      moderatorId: interaction.user.id,
      reason,
    });
  },
};
