const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const spells = [
  'Eldritch Whip',
  'Time Loop',
  'Crimson Bands of Cyttorak',
  'Eye of Agamotto',
  'Portal Surge',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spell')
    .setDescription('Cast a random spell'),

  execute(interaction) {
    const spell = spells[Math.floor(Math.random() * spells.length)];

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Spell Cast')
      .setDescription(`**Dr Strange casts:** ${spell}`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
