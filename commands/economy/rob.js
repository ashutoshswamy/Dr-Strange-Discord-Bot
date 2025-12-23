const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Attempt to rob someone')
    .addUserOption(o => o.setName('user').setDescription('Target').setRequired(true)),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const targetUser = interaction.options.getUser('user');

    if (targetUser.bot) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Target')
        .setDescription('Cannot rob bots.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    if (targetUser.id === interaction.user.id) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Target')
        .setDescription('Cannot rob yourself.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const robber = await getUser(interaction.user.id, interaction.guild.id);
    const target = await getUser(targetUser.id, interaction.guild.id);

    if (robber.balance < 100) {
      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Insufficient Funds')
        .setDescription('You need at least **100** ME to attempt a robbery.')
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    if (target.balance < 100) {
      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Target Too Poor')
        .setDescription('Target does not have enough to rob.')
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const success = Math.random() < 0.4;
    const amount = Math.floor(target.balance * 0.25);

    if (success) {
      robber.balance += amount;
      target.balance -= amount;

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Robbery Successful')
        .setDescription(`You robbed **${amount.toLocaleString()}** ME from **${targetUser.username}**`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else {
      const fine = Math.min(100, robber.balance);
      robber.balance -= fine;

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Caught')
        .setDescription(`You got caught and lost **${fine.toLocaleString()}** ME`)
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }

    await robber.save();
    await target.save();
  },
};
