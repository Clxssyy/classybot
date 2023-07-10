const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pfp')
        .setDescription('Displays the users profile picture.')
        // .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription(
                    'The member you wish to view (default: user who ran command)'
                )
        ),
    async execute(interaction) {
        let username = '';
        let imageURL = '';
        // Create generated image attachment
        if (interaction.options.getUser('user')) {
            username = await interaction.options.getUser('user').username;
            imageURL = await interaction.options
                .getUser('user')
                .displayAvatarURL();
        } else {
            username = await interaction.user.username;
            imageURL = await interaction.user.displayAvatarURL();
        }

        // Create profile picture attachment
        const attachment = new AttachmentBuilder(imageURL, {
            name: `${username}-avatar.png`,
        });

        // Create embed
        const embed = new EmbedBuilder()
            .setColor(0x6ab7dd)
            .setTitle(`${username}'s Profile Picture`)
            .setImage(`attachment://${username}-avatar.png`);

        if (interaction.options.getUser('user')) {
            await interaction.reply({
                embeds: [embed],
                files: [attachment],
            });
        } else {
            await interaction.reply({
                embeds: [embed],
                files: [attachment],
            });
        }
    },
};
