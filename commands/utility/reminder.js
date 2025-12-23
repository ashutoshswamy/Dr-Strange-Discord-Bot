const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addIntegerOption(o =>
      o.setName('minutes')
        .setDescription('Remind after how many minutes')
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(o =>
      o.setName('message')
        .setDescription('Reminder message')
        .setRequired(true)
    ),

  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes');
    const message = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Reminder Set')
      .setDescription(`I'll remind you in **${minutes} minute(s)**.`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

    setTimeout(() => {
      const reminderEmbed = new EmbedBuilder()
        .setColor(0xF59E0B)
        .setTitle('Reminder')
        .setDescription(message)
        .setTimestamp();

      interaction.followUp({
        embeds: [reminderEmbed],
      });
    }, minutes * 60 * 1000);
  },
};
