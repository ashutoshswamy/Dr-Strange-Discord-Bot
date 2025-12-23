const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a dice and gamble ME')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Bet amount').setRequired(true)
    ),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const amount = interaction.options.getInteger('amount');

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

    const roll = Math.floor(Math.random() * 6) + 1;

    if (roll >= 4) {
      user.balance += amount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Dice Roll - You Won!')
        .setDescription(`You rolled **${roll}** and won **${amount.toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else {
      user.balance -= amount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Dice Roll - You Lost!')
        .setDescription(`You rolled **${roll}** and lost **${amount.toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }
  },
};
