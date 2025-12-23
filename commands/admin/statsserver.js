const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('statsserver')
    .setDescription('View server stats')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guild = interaction.guild;

    // Fetch members to get accurate online count
    await guild.members.fetch();

    // Channel breakdown
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;

    // Member counts
    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = totalMembers - botCount;

    // Verification level mapping
    const verificationLevels = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High'
    };

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Server Statistics')
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Members', value: `${totalMembers.toLocaleString()}`, inline: true },
        { name: 'Humans', value: `${humanCount.toLocaleString()}`, inline: true },
        { name: 'Bots', value: `${botCount.toLocaleString()}`, inline: true },
        { name: 'Online', value: `${onlineMembers.toLocaleString()}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size.toLocaleString()}`, inline: true },
        { name: 'Emojis', value: `${guild.emojis.cache.size.toLocaleString()}`, inline: true },
        { name: 'Total Channels', value: `${guild.channels.cache.size.toLocaleString()}`, inline: true },
        { name: 'Text Channels', value: `${textChannels.toLocaleString()}`, inline: true },
        { name: 'Voice Channels', value: `${voiceChannels.toLocaleString()}`, inline: true },
        { name: 'Categories', value: `${categories.toLocaleString()}`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
        { name: 'Boost Level', value: `Tier ${guild.premiumTier}`, inline: true },
        { name: 'Verification', value: verificationLevels[guild.verificationLevel] || 'Unknown', inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: `Server ID: ${guild.id}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
