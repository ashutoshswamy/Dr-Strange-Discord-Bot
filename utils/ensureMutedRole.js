const { PermissionsBitField } = require('discord.js');

async function ensureMutedRole(guild) {
  let role = guild.roles.cache.find(r => r.name === 'Muted');

  if (!role) {
    role = await guild.roles.create({
      name: 'Muted',
      color: '#555555',
      permissions: [],
      reason: 'Auto-created muted role',
    });
  }

  // Apply permissions to all channels
  for (const channel of guild.channels.cache.values()) {
    if (!channel.permissionsFor(guild.members.me)) continue;

    await channel.permissionOverwrites.edit(role, {
      SendMessages: false,
      AddReactions: false,
      Speak: false,
    }).catch(() => {});
  }

  return role;
}

module.exports = ensureMutedRole;
