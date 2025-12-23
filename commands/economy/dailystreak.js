const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dailystreak')
    .setDescription('View your daily streak'),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const user = await getUser(interaction.user.id, interaction.guild.id);

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Daily Streak')
      .setDescription(`Your current streak: **${(user.dailyStreak || 0).toLocaleString()} days**`)
      .setFooter({ text: interaction.user.username })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
