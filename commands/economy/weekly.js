const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

const WEEKLY_AMOUNT = 1500;
const COOLDOWN = 1000 * 60 * 60 * 24 * 7; // 7 days

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Claim your weekly Multiverse Energy'),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);

    if (user.lastWeekly && Date.now() - user.lastWeekly < COOLDOWN) {
      const next = Math.floor((user.lastWeekly.getTime() + COOLDOWN) / 1000);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Cooldown Active')
        .setDescription(`You can claim again <t:${next}:R>`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    user.balance += WEEKLY_AMOUNT;
    user.lastWeekly = new Date();
    await user.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Weekly Reward Claimed')
      .setDescription(`You received **${WEEKLY_AMOUNT.toLocaleString()}** Multiverse Energy`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
