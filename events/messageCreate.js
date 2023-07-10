const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.content.includes('clown')) {
            message.react('🤡');
        }
    },
};
