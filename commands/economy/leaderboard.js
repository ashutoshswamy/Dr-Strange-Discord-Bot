const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');
const { isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the richest users in this server'),

  async execute(interaction) {
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const users = await UserEconomy.find({ guildId: interaction.guild.id })
      .sort({ balance: -1 })
      .limit(10);

    if (!users.length) {
      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Multiverse Leaderboard')
        .setDescription('No economy data yet.')
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const leaderboard = await Promise.all(
      users.map(async (u, i) => {
        const member = await interaction.guild.members.fetch(u.userId).catch(() => null);
        const name = member ? member.user.username : 'Unknown User';
        return `**${i + 1}. ${name}** — ${u.balance.toLocaleString()} ME`;
      })
    );

    const embed = new EmbedBuilder()
      .setTitle('Multiverse Leaderboard')
      .setDescription(leaderboard.join('\n'))
      .setColor(0x1E4ED8)
      .setFooter({ text: 'Top timelines analyzed' })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
