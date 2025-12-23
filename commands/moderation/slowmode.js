const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for the channel')
    .addIntegerOption(o =>
      o.setName('seconds')
        .setDescription('Slowmode duration')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()
      .setColor(0x1F2937)
      .setTitle('Slowmode Updated')
      .setDescription(seconds === 0 
        ? 'Slowmode has been disabled.' 
        : `Slowmode set to **${seconds.toLocaleString()} seconds**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
