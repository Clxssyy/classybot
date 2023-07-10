const { Events } = require('discord.js');

module.exports = {
    name: Events.TypingStart,
    async execute(typing) {
        if (typing.user.bot) {
            return;
        }

        if (typing.user.id == '168459082242457600') {
            typing.client.user.setPresence({
                activities: [{ name: `${typing.user.username}`, type: 3 }],
                status: 'online',
            });
            setTimeout(function () {
                typing.client.user.setPresence({
                    activities: [{ name: 'with discord.js' }],
                    status: 'idle',
                });
            }, 7000);
        }
    },
};
