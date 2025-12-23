const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw Multiverse Energy from your bank')
    .addStringOption(opt =>
      opt.setName('amount').setDescription('Amount to withdraw (or "all")').setRequired(true)
    ),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const amountStr = interaction.options.getString('amount');
    const user = await getUser(interaction.user.id, interaction.guild.id);

    let amount;
    if (amountStr.toLowerCase() === 'all') {
      amount = user.bank;
    } else {
      amount = parseInt(amountStr);
    }

    if (isNaN(amount) || amount <= 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Amount')
        .setDescription('Please enter a valid withdrawal amount or "all".')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    if (user.bank < amount) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Insufficient Balance')
        .setDescription('You do not have enough in your bank.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    user.bank -= amount;
    user.balance += amount;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Withdrawal Successful')
      .setDescription(`Withdrew **${amount.toLocaleString()}** ME from your bank`)
      .addFields(
        { name: 'Wallet', value: `**${user.balance.toLocaleString()}** ME`, inline: true },
        { name: 'Bank', value: `**${user.bank.toLocaleString()}** ME`, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
