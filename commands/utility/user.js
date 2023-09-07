const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(
          'The member you wish to view (default: user who ran command)'
        )
    )
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.options.getMember('user') ?? interaction.member;
    const flags = member.user.flags.toArray().join(', ');

    await interaction.reply(
      `Username: ${member.user.username}\nJoined: <t:${Math.floor(
        member.joinedTimestamp / 1000
      )}:R> Flags: ${flags}`
    );
  },
};
