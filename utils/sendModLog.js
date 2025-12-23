const { EmbedBuilder } = require('discord.js');
const ModLog = require('../models/ModLog');

async function sendModLog(guild, data) {
  // Save to database
  await ModLog.create({
    guildId: guild.id,
    userId: data.userId,
    moderatorId: data.moderatorId,
    action: data.action,
    reason: data.reason || 'No reason provided',
  });

  // Send to mod-logs channel
  let channel = guild.channels.cache.find(c => c.name === 'mod-logs');

  if (!channel) {
    channel = await guild.channels.create({
      name: 'mod-logs',
      type: 0, // text channel
      reason: 'Auto-created moderation log channel',
    });
  }

  const embed = new EmbedBuilder()
    .setTitle(`Moderation Action: ${data.action}`)
    .setColor(0xff5555)
    .addFields(
      { name: 'User', value: `<@${data.userId}>`, inline: true },
      { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
      { name: 'Reason', value: data.reason || 'No reason provided' }
    )
    .setTimestamp();

  channel.send({ embeds: [embed] });
}

module.exports = sendModLog;

