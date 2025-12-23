const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Get world time')
    .addStringOption(o =>
      o.setName('timezone')
        .setDescription('Select a timezone')
        .setRequired(true)
        .addChoices(
          { name: 'India (Kolkata)', value: 'Asia/Kolkata' },
          { name: 'USA - New York', value: 'America/New_York' },
          { name: 'USA - Los Angeles', value: 'America/Los_Angeles' },
          { name: 'USA - Chicago', value: 'America/Chicago' },
          { name: 'UK (London)', value: 'Europe/London' },
          { name: 'France (Paris)', value: 'Europe/Paris' },
          { name: 'Germany (Berlin)', value: 'Europe/Berlin' },
          { name: 'Russia (Moscow)', value: 'Europe/Moscow' },
          { name: 'UAE (Dubai)', value: 'Asia/Dubai' },
          { name: 'Saudi Arabia (Riyadh)', value: 'Asia/Riyadh' },
          { name: 'Pakistan (Karachi)', value: 'Asia/Karachi' },
          { name: 'Bangladesh (Dhaka)', value: 'Asia/Dhaka' },
          { name: 'Singapore', value: 'Asia/Singapore' },
          { name: 'China (Shanghai)', value: 'Asia/Shanghai' },
          { name: 'Hong Kong', value: 'Asia/Hong_Kong' },
          { name: 'Japan (Tokyo)', value: 'Asia/Tokyo' },
          { name: 'South Korea (Seoul)', value: 'Asia/Seoul' },
          { name: 'Australia (Sydney)', value: 'Australia/Sydney' },
          { name: 'Australia (Melbourne)', value: 'Australia/Melbourne' },
          { name: 'New Zealand (Auckland)', value: 'Pacific/Auckland' },
          { name: 'Brazil (Sao Paulo)', value: 'America/Sao_Paulo' },
          { name: 'Canada (Toronto)', value: 'America/Toronto' },
          { name: 'Mexico (Mexico City)', value: 'America/Mexico_City' },
          { name: 'South Africa (Johannesburg)', value: 'Africa/Johannesburg' },
          { name: 'Egypt (Cairo)', value: 'Africa/Cairo' }
        )
    ),

  async execute(interaction) {
    const zone = interaction.options.getString('timezone');

    try {
      const now = new Date();
      
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const formattedTime = timeFormatter.format(now);

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle(`Time in ${zone.replace('_', ' ')}`)
        .setDescription(formattedTime)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Invalid timezone.')
        .setTimestamp();
      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};

