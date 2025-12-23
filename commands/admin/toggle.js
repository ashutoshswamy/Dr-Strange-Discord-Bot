const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../services/guildConfigService');

const features = {
  economy: {
    name: 'Economy System',
    field: 'economyEnabled'
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggle')
    .setDescription('Toggle a bot feature on or off')
    .addStringOption(o =>
      o.setName('feature')
        .setDescription('Feature to toggle')
        .setRequired(true)
        .addChoices(
          { name: 'Economy', value: 'economy' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const featureKey = interaction.options.getString('feature');
    const feature = features[featureKey];

    if (!feature) {
      const embed = new EmbedBuilder()
        .setColor(0xDC2626)
        .setTitle('Invalid Feature')
        .setDescription('Unknown feature specified.')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    const config = await getConfig(interaction.guild.id);
    config[feature.field] = !config[feature.field];
    await config.save();

    const newState = config[feature.field] ? 'ENABLED' : 'DISABLED';

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Feature Toggled')
      .setDescription(`**${feature.name}** is now **${newState}**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
