const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Bet Multiverse Energy on a coin flip')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Bet amount').setRequired(true)
    )
    .addStringOption(o =>
      o.setName('choice')
        .setDescription('heads or tails')
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const amount = interaction.options.getInteger('amount');
    const choice = interaction.options.getString('choice');

    if (amount <= 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Bet')
        .setDescription('Please enter a valid bet amount.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);

    if (user.balance < amount) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Insufficient Balance')
        .setDescription('You do not have enough Multiverse Energy.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails';

    if (choice === result) {
      user.balance += amount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Coin Flip - You Won!')
        .setDescription(`The coin landed on **${result.toUpperCase()}**!\nYou won **${amount.toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else {
      user.balance -= amount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Coin Flip - You Lost!')
        .setDescription(`The coin landed on **${result.toUpperCase()}**!\nYou lost **${amount.toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }
  },
};
