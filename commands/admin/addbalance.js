const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { addBalance } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addbalance')
    .setDescription('Add ME to a user')
    .addUserOption(o =>
      o.setName('user').setDescription('Target user').setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount to add').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    await addBalance(user.id, interaction.guild.id, amount);

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Balance Added')
      .setDescription(`Added **${amount.toLocaleString()}** ME to **${user.username}**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
