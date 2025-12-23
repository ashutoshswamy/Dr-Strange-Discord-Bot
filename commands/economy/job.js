const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, isEconomyEnabled, economyDisabledEmbed } = require('../../services/economyService');
const jobs = require('../../data/jobs');

// Generate choices from jobs data
const jobChoices = Object.keys(jobs).map(key => ({
  name: key.charAt(0).toUpperCase() + key.slice(1),
  value: key
}));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('job')
    .setDescription('Set your job')
    .addStringOption(o =>
      o.setName('name')
        .setDescription('Job name')
        .setRequired(true)
        .addChoices(...jobChoices)
    ),

  async execute(interaction) {
    // Check if economy is enabled
    if (!await isEconomyEnabled(interaction.guild.id)) {
      return interaction.reply({ embeds: [economyDisabledEmbed()] });
    }

    const jobName = interaction.options.getString('name');
    const user = await getUser(interaction.user.id, interaction.guild.id);
    const jobData = jobs[jobName];

    // Check requirements
    if (jobData.requirement) {
      const req = jobData.requirement;
      
      if (req.type === 'balance') {
        const totalBalance = user.balance + user.bank;
        if (totalBalance < req.amount) {
          const embed = new EmbedBuilder()
            .setColor(0xEF4444)
            .setTitle('Requirement Not Met')
            .setDescription(`You need **${req.amount.toLocaleString()} ME** total balance to become a **${jobName}**.`)
            .addFields({ name: 'Your Balance', value: `${totalBalance.toLocaleString()} ME` })
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }
      }
      
      if (req.type === 'job') {
        if (!user.jobHistory.includes(req.job)) {
          const embed = new EmbedBuilder()
            .setColor(0xEF4444)
            .setTitle('Requirement Not Met')
            .setDescription(`You must have worked as **${req.job}** before becoming a **${jobName}**.`)
            .addFields({ name: 'Your Job History', value: user.jobHistory.length > 0 ? user.jobHistory.join(', ') : 'None' })
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }
      }
    }

    // Add current job to history if not already there
    if (user.job && !user.jobHistory.includes(user.job)) {
      user.jobHistory.push(user.job);
    }

    user.job = jobName;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor(0x1E4ED8)
      .setTitle('Job Assigned')
      .setDescription(`You are now a **${jobName}**`)
      .addFields(
        { name: 'Pay', value: `${jobData.pay.toLocaleString()} ME/work`, inline: true },
        { name: 'Description', value: jobData.description, inline: false }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};

