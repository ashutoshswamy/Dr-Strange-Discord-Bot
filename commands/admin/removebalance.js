const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { removeBalance } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removebalance')
    .setDescription('Remove ME from a user')
    .addUserOption(o =>
      o.setName('user').setDescription('Target user').setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount to remove').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    await removeBalance(user.id, interaction.guild.id, amount);

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Balance Removed')
      .setDescription(`Removed **${amount.toLocaleString()}** ME from **${user.username}**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
