const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply(
            `Server: ${interaction.guild.name}\nVerified: ${interaction.guild.verified}\nMembers: ${interaction.guild.memberCount}`
        );
    },
};
