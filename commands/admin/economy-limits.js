const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../services/guildConfigService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('economy-limits')
    .setDescription('Set daily economy limits')
    .addIntegerOption(o =>
      o.setName('amount')
        .setDescription('Daily earning limit')
        .setRequired(true)
        .setMinValue(0)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const config = await getConfig(interaction.guild.id);

    config.dailyLimit = amount;
    await config.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Daily Limit Set')
      .setDescription(`Daily economy limit set to **${amount.toLocaleString()}** ME`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
