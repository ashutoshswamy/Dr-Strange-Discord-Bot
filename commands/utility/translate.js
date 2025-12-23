const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a message')
    .addStringOption(o =>
      o.setName('text')
        .setDescription('Text to translate')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('to')
        .setDescription('Target language')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Hindi', value: 'hi' },
          { name: 'Spanish', value: 'es' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Italian', value: 'it' },
          { name: 'Portuguese', value: 'pt' },
          { name: 'Russian', value: 'ru' },
          { name: 'Japanese', value: 'ja' },
          { name: 'Korean', value: 'ko' },
          { name: 'Chinese (Simplified)', value: 'zh-CN' },
          { name: 'Chinese (Traditional)', value: 'zh-TW' },
          { name: 'Arabic', value: 'ar' },
          { name: 'Bengali', value: 'bn' },
          { name: 'Tamil', value: 'ta' },
          { name: 'Telugu', value: 'te' },
          { name: 'Marathi', value: 'mr' },
          { name: 'Gujarati', value: 'gu' },
          { name: 'Kannada', value: 'kn' },
          { name: 'Malayalam', value: 'ml' },
          { name: 'Punjabi', value: 'pa' },
          { name: 'Thai', value: 'th' },
          { name: 'Vietnamese', value: 'vi' },
          { name: 'Dutch', value: 'nl' },
          { name: 'Turkish', value: 'tr' }
        )
    ),

  async execute(interaction) {
    try {
      const text = interaction.options.getString('text');
      const to = interaction.options.getString('to');

      const url =
        `https://translate.googleapis.com/translate_a/single?` +
        `client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

      const res = await fetch(url);
      const data = await res.json();

      const translated = data[0].map(t => t[0]).join('');

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle('Translation')
        .addFields(
          { name: 'Original', value: text },
          { name: 'Translated', value: translated }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('Translation failed in this timeline.')
        .setTimestamp();
      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
