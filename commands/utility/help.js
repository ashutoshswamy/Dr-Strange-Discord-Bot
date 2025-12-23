const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const categories = {
  admin: { name: 'Admin', description: 'Server administration commands' },
  ai: { name: 'AI', description: 'AI-powered commands using Dr Strange' },
  economy: { name: 'Economy', description: 'Multiverse Energy economy commands' },
  fun: { name: 'Fun', description: 'Fun and entertainment commands' },
  moderation: { name: 'Moderation', description: 'Server moderation commands' },
  utility: { name: 'Utility', description: 'Utility and information commands' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all available commands')
    .addStringOption(o =>
      o.setName('category')
        .setDescription('Command category to view')
        .addChoices(
          { name: 'Admin', value: 'admin' },
          { name: 'AI', value: 'ai' },
          { name: 'Economy', value: 'economy' },
          { name: 'Fun', value: 'fun' },
          { name: 'Moderation', value: 'moderation' },
          { name: 'Utility', value: 'utility' }
        )
    ),

  async execute(interaction, client) {
    const category = interaction.options.getString('category');

    if (category) {
      // Show commands for specific category
      const categoryInfo = categories[category];
      const commandsPath = path.join(__dirname, '..', category);

      let commands = [];
      if (fs.existsSync(commandsPath)) {
        const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
        commands = files.map(file => {
          const cmd = require(path.join(commandsPath, file));
          return {
            name: cmd.data.name,
            description: cmd.data.description
          };
        });
      }

      const commandList = commands.length > 0
        ? commands.map(c => `**/${c.name}**\n> ${c.description}`).join('\n\n')
        : 'No commands available.';

      const embed = new EmbedBuilder()
        .setColor(0x1E4ED8)
        .setTitle(`${categoryInfo.name} Commands`)
        .setDescription(commandList)
        .setFooter({ text: `Use /help to view all categories` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // Show all categories
    const categoryList = Object.entries(categories)
      .map(([key, val]) => `**${val.name}**\n> ${val.description}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Dr Strange Help')
      .setDescription(`Welcome to the Sanctum Sanctorum. Here are the available command categories:\n\n${categoryList}`)
      .setFooter({ text: 'Use /help category:<name> to view commands in a category' })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
