const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const role = interaction.guild.roles.cache.find(r => r.name === 'Muted');

    if (!role || !member.roles.cache.has(role.id)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('User is not muted.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    await member.roles.remove(role);

    const embed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle('User Unmuted')
      .setDescription(`**${member.user.tag}** has been unmuted.`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
