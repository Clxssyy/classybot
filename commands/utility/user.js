const { SlashCommandBuilder } = require('discord.js');

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
        const member = interaction.options.getMember('user') ?? '';
        if (member != '') {
            await interaction.reply(
                `Username: ${member.user.username}\nJoined: ${member.joinedAt}`
            );
        } else {
            await interaction.reply(
                `Username: ${interaction.user.username}\nJoined: ${interaction.member.joinedAt}`
            );
        }
    },
};
