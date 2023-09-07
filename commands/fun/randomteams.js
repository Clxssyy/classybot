const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomteams')
    .setDescription('Splits users in a voice channel into equal teams!')
    .addChannelOption((option) =>
      option
        .setName('team2-channel')
        .setDescription('The channel that team 2 will be moved to.')
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    const team2VC = interaction.options.getChannel('team2-channel');
    const originalVC = interaction.member.voice.channel;

    // Check if user is in a voice channel
    if (!interaction.member.voice.channel) {
      interaction.reply('Join a voice channel.');
      return;
    }

    // Check if team 2 channel is a text channel
    if (!team2VC.isVoiceBased()) {
      interaction.reply('Please select a voice channel for team 2.');
      return;
    }

    // Check to make sure team 2 channel is different from original channel
    if (team2VC == originalVC) {
      interaction.reply('Please select a different vocie channel for team 2.');
      return;
    }

    // Split members into 2 teams
    let teamSize = Math.floor(originalVC.members.size / 2);

    // Check team size to make sure each team has at least 1 member
    if (teamSize < 1) {
      interaction.reply('2 or more members must be in the voice channel.');
      return;
    }

    // Move team 2 into the specified channel
    for (teamSize; teamSize > 0; teamSize--) {
      const members = originalVC.members;
      members.random().voice.setChannel(team2VC);
    }

    await interaction.reply('Teams have been moved to separate channels.');
  },
};
