const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll with live results and a time limit')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('The poll question')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('options')
        .setDescription('Options separated by | (max 4)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Poll duration in minutes')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const rawOptions = interaction.options.getString('options');
    const duration = interaction.options.getInteger('duration');

    const options = rawOptions
      .split('|')
      .map(o => o.trim())
      .filter(Boolean)
      .slice(0, 4);

    if (options.length < 2) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('Error')
        .setDescription('You need at least **2 options**.')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const votes = new Map();
    const counts = new Array(options.length).fill(0);

    const endTimestamp = Math.floor(Date.now() / 1000) + duration * 60;

    const buildEmbed = () =>
      new EmbedBuilder()
        .setTitle('Multiverse Poll')
        .setDescription(`**${question}**`)
        .addFields(
          {
            name: 'Poll Ends',
            value: `<t:${endTimestamp}:R>`,
            inline: false,
          },
          {
            name: 'Live Results',
            value: options
              .map((opt, i) => `**${opt}** — ${counts[i]} vote(s)`)
              .join('\n'),
          }
        )
        .setColor(0x6a0dad)
        .setFooter({ text: 'Vote by clicking a button' });

    const row = new ActionRowBuilder();
    options.forEach((option, index) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_${index}`)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const message = await interaction.reply({
      embeds: [buildEmbed()],
      components: [row],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      time: duration * 60 * 1000,
    });

    collector.on('collect', async i => {
      if (votes.has(i.user.id)) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('Already Voted')
          .setDescription('You have already voted in this poll.')
          .setTimestamp();
        return i.reply({ embeds: [errorEmbed] });
      }

      const index = parseInt(i.customId.split('_')[1], 10);

      votes.set(i.user.id, index);
      counts[index]++;

      const successEmbed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('Vote Recorded')
        .setDescription('Your vote has been recorded.')
        .setTimestamp();

      await i.reply({ embeds: [successEmbed] });

      await message.edit({
        embeds: [buildEmbed()],
      });
    });

    collector.on('end', async () => {
      const finalEmbed = new EmbedBuilder()
        .setTitle('Multiverse Poll — Final Results')
        .setDescription(`**${question}**`)
        .addFields({
          name: 'Results',
          value: options
            .map((opt, i) => `**${opt}** — ${counts[i]} vote(s)`)
            .join('\n'),
        })
        .setColor(0x2ecc71)
        .setFooter({ text: 'Poll ended' });

      await message.edit({
        embeds: [finalEmbed],
        components: [],
      });
    });
  },
};
