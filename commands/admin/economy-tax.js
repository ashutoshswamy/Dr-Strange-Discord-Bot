const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../services/guildConfigService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('economy-tax')
    .setDescription('Set economy transaction tax')
    .addIntegerOption(o =>
      o.setName('percent')
        .setDescription('Tax percentage')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(50)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const percent = interaction.options.getInteger('percent');
    const config = await getConfig(interaction.guild.id);

    config.taxPercent = percent;
    await config.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Tax Rate Updated')
      .setDescription(`Economy tax set to **${percent}%**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
