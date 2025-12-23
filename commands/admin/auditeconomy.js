const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auditeconomy')
    .setDescription('Audit economy balances')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const users = await UserEconomy.find({ guildId: interaction.guild.id });
    const total = users.reduce((a, b) => a + b.balance + b.bank, 0);

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Economy Audit')
      .setDescription(`Total ME in circulation: **${total.toLocaleString()}**`)
      .addFields(
        { name: 'Total Users', value: `${users.length.toLocaleString()}`, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
