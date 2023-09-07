const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.')
    .setDMPermission(false),
  async execute(interaction) {
    const owner = await interaction.guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor(0x6ab7dd)
      .setTitle(`${interaction.guild.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        {
          name: 'Owner',
          value: `${owner.user.username}`,
          inline: true,
        },
        {
          name: 'Verified',
          value: `${interaction.guild.verified}`,
          inline: true,
        },
        { name: 'Members', value: `${interaction.guild.memberCount}` },
        {
          name: 'Created',
          value: `<t:${Math.floor(
            interaction.guild.createdTimestamp / 1000
          )}:R>`,
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
