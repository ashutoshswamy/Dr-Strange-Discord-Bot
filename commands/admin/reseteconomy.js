const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reseteconomy')
    .setDescription('Reset economy for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();
    await UserEconomy.deleteMany({ guildId: interaction.guild.id });

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Economy Reset')
      .setDescription('Economy has been reset for this server.')
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
