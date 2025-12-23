const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: false }
    );

    const embed = new EmbedBuilder()
      .setColor(0x1F2937)
      .setTitle('Channel Locked')
      .setDescription(`This channel has been locked by ${interaction.user.tag}.`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
