const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

const draw = () => Math.floor(Math.random() * 10) + 1;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play blackjack')
    .addIntegerOption(o => o.setName('amount').setDescription('Bet').setRequired(true)),

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

    const player = draw() + draw();
    const dealer = draw() + draw();

    if (player > dealer && player <= 21) {
      user.balance += bet;
      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Blackjack - You Win!')
        .addFields(
          { name: 'Your Hand', value: `**${player}**`, inline: true },
          { name: 'Dealer Hand', value: `**${dealer}**`, inline: true },
          { name: 'Winnings', value: `**+${bet.toLocaleString()}** ME`, inline: true }
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else {
      user.balance -= bet;
      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Blackjack - You Lose!')
        .addFields(
          { name: 'Your Hand', value: `**${player}**`, inline: true },
          { name: 'Dealer Hand', value: `**${dealer}**`, inline: true },
          { name: 'Lost', value: `**-${bet.toLocaleString()}** ME`, inline: true }
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }

    await user.save();
  },
};
