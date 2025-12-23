const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getUser } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbalance')
    .setDescription('Set a user balance')
    .addUserOption(o =>
      o.setName('user').setDescription('Target user').setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('amount').setDescription('New balance').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const target = await getUser(user.id, interaction.guild.id);
    target.balance = amount;
    await target.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Balance Set')
      .setDescription(`Balance set to **${amount.toLocaleString()}** ME for **${user.username}**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
