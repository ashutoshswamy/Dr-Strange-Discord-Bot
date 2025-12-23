const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jobs = require('../../data/jobs');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

const COOLDOWN = 1000 * 60 * 60; // 1 hour

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn Multiverse Energy'),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);

    if (!user.job) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('No Job')
        .setDescription('You do not have a job. Use `/job` to get one.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    if (user.lastWork && Date.now() - user.lastWork < COOLDOWN) {
      const next = Math.floor((user.lastWork.getTime() + COOLDOWN) / 1000);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Cooldown Active')
        .setDescription(`You can work again <t:${next}:R>`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    const jobData = jobs[user.job];
    if (!jobData) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Job')
        .setDescription('Your job no longer exists. Use `/job` to get a new one.')
        .setTimestamp();
      user.job = null;
      await user.save();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const pay = jobData.pay;
    user.balance += pay;
    user.lastWork = new Date();
    await user.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Work Complete')
      .setDescription(`You earned **${pay.toLocaleString()}** ME as a **${user.job}**`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
