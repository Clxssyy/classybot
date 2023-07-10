const {
    Events,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    AttachmentBuilder,
} = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const infoChannel = await guild.client.channels.cache.get(
            '1110366740103315516'
        );
        const infoMessages = await infoChannel.messages.fetch();
        const infoBotMessage = infoMessages.find(
            (msg) =>
                msg.author.id === guild.client.user.id &&
                msg.embeds.length === 1
        );

        const featureChannel = await guild.client.channels.cache.get(
            '1110534478188773406'
        );
        const featureMessages = await featureChannel.messages.fetch();
        const featureBotMessage = featureMessages.find(
            (msg) =>
                msg.author.id === guild.client.user.id &&
                msg.embeds.length === 1
        );

        const addBotButton = await new ButtonBuilder()
            .setLabel('Add Bot')
            .setURL(
                'https://discord.com/api/oauth2/authorize?client_id=1046864165387649024&permissions=8&scope=bot%20applications.commands'
            )
            .setStyle(ButtonStyle.Link);
        const joinBotDiscordButton = await new ButtonBuilder()
            .setLabel('Bot Discord')
            .setURL('https://discord.gg/ATUud59GrU')
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder().addComponents(
            joinBotDiscordButton,
            addBotButton
        );
        const botPfp = await new AttachmentBuilder('./pfp.png');

        const info = await new EmbedBuilder()
            .setColor(0x6ab7dd)
            .setTitle('ClassyBot Information')
            .setThumbnail('attachment://pfp.png')
            .setDescription(
                `Creator: Classy#9595
                \nVersion: 1.0.0
                \nClassyBot is a general purpose bot with tons of features.
                \n- Slash Commands
                \n- AI Integration
                \n- Automatic 'Member' Role on Join
                \n- Use \`/bot features\` to view all features in detail.
                \n
                \nServers using ClassyBot: ${guild.client.guilds.cache.size}`
            );

        const feature = await new EmbedBuilder()
            .setColor(0x6ab7dd)
            .setTitle('ClassyBot Features')
            .setThumbnail('attachment://pfp.png')
            .setDescription(
                `Welcome Role
                \n- Make a 'member' role to have it auto added to anyone who joins.
                \n
                \nSlash Commands
                \n- AI
                \n - \`/ai (prompt)\` : Ask AI anything you desire!
                \n - \`/ai-image (prompt)\` : Use AI to generate an image of anything you desire!
                \n- Fun
                \n - \`/avatar\` : Generate a random scuffed avatar!
                \n - \`/randomfact (today | random)\` : Get a random fact or today's fact (default: random)!
                \n - \`/randomteams (channel)\` : Split users in your voice channel into random teams and send other team to a specific channel!
                \n- Utility
                \n - \`/server\` : View general server information.
                \n - \`/user (user)\` : View general user information (default: command sender).
                \n - \`/pfp (user)\` : View user's profile picture (default: command sender).
                \n - \`/ping\` : Bot responds with 'pong'.
                \n - \`/bot info\` : View ClassyBot's information.
                \n - \`/bot features\` : View ClassyBot's features (command to view what you're seeing now).
                \n
                \nServers using ClassyBot: ${guild.client.guilds.cache.size}`
            );

        infoBotMessage.edit({
            embeds: [info],
            components: [row],
            files: [botPfp],
        });
        featureBotMessage.edit({
            embeds: [feature],
            components: [row],
            files: [botPfp],
        });
    },
};
