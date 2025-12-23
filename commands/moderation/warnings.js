const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ModLog = require('../../models/ModLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings of a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const logs = await ModLog.find({
      guildId: interaction.guild.id,
      userId: user.id,
      action: 'WARN',
    });

    if (!logs.length) {
      const embed = new EmbedBuilder()
        .setColor(0xF59E0B)
        .setTitle('Warnings')
        .setDescription(`${user.tag} has no warnings.`)
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(0xF59E0B)
      .setTitle(`Warnings for ${user.tag}`)
      .setDescription(logs.map((l, i) => `**${i + 1}.** ${l.reason}`).join('\n'))
      .setFooter({ text: `Total: ${logs.length} warning(s)` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
