const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch').default;

// Fallback compliments in case API fails
const fallbackCompliments = [
  'You have an amazing sense of humor!',
  'Your creativity inspires everyone around you.',
  'You make the world a better place just by being in it.',
  'Your positive attitude is contagious!',
  'You have a wonderful way of making people feel valued.',
  'Your determination is truly admirable.',
  'You are incredibly talented and capable.',
  'Your kindness knows no bounds.',
  'You light up every room you walk into.',
  'Your intelligence and wit are impressive.',
  'You have a heart of gold.',
  'Your smile brightens everyone\'s day.',
  'You are stronger than you know.',
  'Your authenticity is refreshing.',
  'You make a real difference in people\'s lives.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('Get a compliment')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to compliment (optional)')
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user') || interaction.user;

    try {
      const res = await fetch('https://www.affirmations.dev/');
      const data = await res.json();

      let compliment;
      if (data && data.affirmation) {
        compliment = data.affirmation;
      } else {
        compliment = fallbackCompliments[Math.floor(Math.random() * fallbackCompliments.length)];
      }

      const embed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('Compliment')
        .setDescription(`${user}, ${compliment}`)
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      // Use fallback on error
      const compliment = fallbackCompliments[Math.floor(Math.random() * fallbackCompliments.length)];

      const embed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('Compliment')
        .setDescription(`${user}, ${compliment}`)
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    }
  },
};
