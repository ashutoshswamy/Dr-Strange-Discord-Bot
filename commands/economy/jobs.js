const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jobs = require('../../data/jobs');
const { isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jobs')
    .setDescription('View available jobs'),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }
    const list = Object.entries(jobs)
      .map(([k, v]) => `**${k}** — ${v.pay.toLocaleString()} ME\n> ${v.description}\n> *${v.requirementText}*`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Available Jobs')
      .setDescription(list)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
