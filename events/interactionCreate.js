const { InteractionType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        interaction.followUp({
          content: '❌ Something went wrong in this timeline.',
          ephemeral: true
        });
      } else {
        interaction.reply({
          content: '❌ Something went wrong in this timeline.',
          ephemeral: true
        });
      }
    }
  },
};
