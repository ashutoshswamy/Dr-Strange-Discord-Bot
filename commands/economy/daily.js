const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

const DAILY_AMOUNT = 250;
const COOLDOWN = 1000 * 60 * 60 * 24; // 24h

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily Multiverse Energy'),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);

    if (user.lastDaily && Date.now() - user.lastDaily < COOLDOWN) {
      const next = Math.floor((user.lastDaily.getTime() + COOLDOWN) / 1000);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Cooldown Active')
        .setDescription(`You can claim again <t:${next}:R>`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // Apply streak bonus
    const isConsecutive = user.lastDaily && (Date.now() - user.lastDaily < COOLDOWN * 2);
    if (isConsecutive) {
      user.dailyStreak = (user.dailyStreak || 0) + 1;
    } else {
      user.dailyStreak = 1;
    }

    const streakBonus = Math.min(user.dailyStreak * 10, 100); // Max 100 ME bonus
    const totalAmount = DAILY_AMOUNT + streakBonus;

    user.balance += totalAmount;
    user.lastDaily = new Date();
    await user.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Daily Reward Claimed')
      .setDescription(`You received **${totalAmount.toLocaleString()}** Multiverse Energy`)
      .addFields(
        { name: 'Base Reward', value: `${DAILY_AMOUNT} ME`, inline: true },
        { name: 'Streak Bonus', value: `+${streakBonus} ME`, inline: true },
        { name: 'Current Streak', value: `${user.dailyStreak} days`, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
