const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: true }
    );

    const embed = new EmbedBuilder()
      .setColor(0x1F2937)
      .setTitle('Channel Unlocked')
      .setDescription(`This channel has been unlocked by ${interaction.user.tag}.`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
