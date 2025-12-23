const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { getConfig } = require('../../services/guildConfigService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Auto setup server with roles & channels')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    const guild = interaction.guild;
    const results = [];

    // Create Muted role if doesn't exist
    let mutedRole = guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) {
      try {
        mutedRole = await guild.roles.create({
          name: 'Muted',
          color: 0x808080,
          permissions: [],
          reason: 'Auto setup by Dr Strange bot'
        });

        // Set permissions for all text channels
        guild.channels.cache.forEach(async channel => {
          if (channel.isTextBased()) {
            await channel.permissionOverwrites.create(mutedRole, {
              SendMessages: false,
              AddReactions: false
            }).catch(() => {});
          }
        });

        results.push('Created **Muted** role');
      } catch {
        results.push('Failed to create Muted role');
      }
    } else {
      results.push('**Muted** role already exists');
    }

    // Create mod-logs channel if doesn't exist
    let modLogs = guild.channels.cache.find(c => c.name === 'mod-logs');
    if (!modLogs) {
      try {
        modLogs = await guild.channels.create({
          name: 'mod-logs',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: ['ViewChannel']
            }
          ],
          reason: 'Auto setup by Dr Strange bot'
        });
        results.push('Created **#mod-logs** channel');
      } catch {
        results.push('Failed to create mod-logs channel');
      }
    } else {
      results.push('**#mod-logs** channel already exists');
    }

    // Initialize economy config
    const config = await getConfig(guild.id);
    if (!config.economyEnabled) {
      config.economyEnabled = true;
      await config.save();
      results.push('Economy **enabled**');
    } else {
      results.push('Economy already enabled');
    }

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Server Setup Complete')
      .setDescription(results.join('\n'))
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
