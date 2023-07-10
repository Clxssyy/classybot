const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const role = member.guild.roles.cache.find(
                (role) => role.name === 'Member'
            );
            if (role) {
                await member.roles.add(role);
                console.log(
                    `[Welcome Role] Added role '${role.name}' to ${member.user.tag} in '${member.guild.name}'`
                );
            } else {
                throw `Role 'Member' not found in the '${member.guild.name}'`;
            }
        } catch (error) {
            console.error(`[ERROR - 'GuildMemberAdd' event] `, error);
        }
    },
};
