const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your Multiverse Energy balance'),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);
    const total = user.balance + user.bank;

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Balance')
      .addFields(
        { name: 'Wallet', value: `**${user.balance.toLocaleString()}** ME`, inline: true },
        { name: 'Bank', value: `**${user.bank.toLocaleString()}** ME`, inline: true },
        { name: 'Total', value: `**${total.toLocaleString()}** ME`, inline: true }
      )
      .setFooter({ text: interaction.user.username })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
