const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bet')
    .setDescription('High risk, high reward bet')
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
        .setTitle('Invalid Amount')
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

    const win = Math.random() < 0.4; // 40% win chance

    if (win) {
      const reward = amount * 2;
      user.balance += amount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('You Won!')
        .setDescription(`You won **${reward.toLocaleString()}** ME from the bet!`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else {
      user.balance -= amount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('You Lost!')
        .setDescription(`You lost **${amount.toLocaleString()}** ME in the bet.`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }
  },
};
