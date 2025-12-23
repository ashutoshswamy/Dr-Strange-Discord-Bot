const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages')
    .addIntegerOption(o =>
      o.setName('count')
        .setDescription('Number of messages to delete (1–100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const count = interaction.options.getInteger('count');
    const channel = interaction.channel;

    await interaction.deferReply();
    const messages = await channel.bulkDelete(count, true);

    const embed = new EmbedBuilder()
      .setColor(0x1F2937)
      .setTitle('Messages Purged')
      .setDescription(`Deleted **${messages.size.toLocaleString()}** messages.`)
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
