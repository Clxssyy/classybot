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

    if (member.user.flags.toArray().length === 0) {
      var flags = 'None';
    } else {
      var flags = member.user.flags.toArray().join(', ');
    }

    const roles = member.roles.cache
      .filter((role) => role.id !== interaction.guild.id)
      .map((role) => role.toString())
      .join(' | ');

    const embed = await new EmbedBuilder()
      .setColor(member.displayHexColor)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTitle(member.user.username)
      .addFields(
        {
          name: 'Joined',
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        },
        { name: 'Roles', value: roles },
        { name: 'Flags', value: flags }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
