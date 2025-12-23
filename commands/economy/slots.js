const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

const symbols = ['🍒', '🍋', '🍉', '⭐'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play slot machine')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Bet amount').setRequired(true)
    ),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const bet = interaction.options.getInteger('amount');
    const user = await getUser(interaction.user.id, interaction.guild.id);

    if (user.balance < bet) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Insufficient Balance')
        .setDescription('You do not have enough Multiverse Energy.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const roll = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    if (new Set(roll).size === 1) {
      user.balance += bet * 2;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Slots - Jackpot!')
        .setDescription(`${roll.join(' ')}\n\nYou WON **${(bet * 2).toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else {
      user.balance -= bet;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Slots - You Lost')
        .setDescription(`${roll.join(' ')}\n\nYou lost **${bet.toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }
  },
};
