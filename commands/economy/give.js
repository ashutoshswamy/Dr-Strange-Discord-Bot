const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed, applyTax } = require('../../services/economyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give Multiverse Energy to another user')
    .addUserOption(o =>
      o.setName('user').setDescription('User to give ME to').setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount of ME').setRequired(true)
    ),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (target.bot) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Target')
        .setDescription('Cannot give Multiverse Energy to bots.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    if (target.id === interaction.user.id) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Target')
        .setDescription('Cannot give Multiverse Energy to yourself.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    if (amount <= 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Invalid Amount')
        .setDescription('Please enter a valid amount.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const sender = await getUser(interaction.user.id, interaction.guild.id);

    if (sender.balance < amount) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Insufficient Balance')
        .setDescription('You do not have enough Multiverse Energy.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    // Apply tax to the transfer
    const { net, tax } = await applyTax(interaction.guild.id, amount);

    sender.balance -= amount;
    await sender.save();

    const receiver = await getUser(target.id, interaction.guild.id);
    receiver.balance += net;
    await receiver.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Transfer Successful')
      .setDescription(`**${interaction.user.username}** gave **${net.toLocaleString()}** ME to **${target.username}**`)
      .setTimestamp();

    if (tax > 0) {
      embed.addFields({ name: 'Tax Deducted', value: `${tax.toLocaleString()} ME`, inline: true });
    }

    interaction.reply({ embeds: [embed] });
  },
};
