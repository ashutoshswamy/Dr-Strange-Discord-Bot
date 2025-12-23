const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get weather info')
    .addStringOption(o =>
      o.setName('city')
        .setDescription('City name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const city = interaction.options.getString('city');
    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('City not found.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle(`Weather in ${data.name}`)
      .addFields(
        { name: 'Temperature', value: `${data.main.temp}°C`, inline: true },
        { name: 'Humidity', value: `${data.main.humidity}%`, inline: true },
        { name: 'Condition', value: data.weather[0].description, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
