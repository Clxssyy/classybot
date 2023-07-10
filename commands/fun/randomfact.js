const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomfact')
        .setDescription('Sends a random fact')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription(
                    'Choose which fact to display (default: random fact)'
                )
                .addChoices(
                    { name: 'today', value: 'today' },
                    { name: 'random', value: 'random' }
                )
        ),
    async execute(interaction) {
        if (interaction.options.getString('type')) {
            await fetch(
                `https://uselessfacts.jsph.pl/api/v2/facts/${interaction.options.getString(
                    'type'
                )}`
            )
                .then((response) => response.json())
                .then((data) => {
                    // Process the data and perform actions
                    interaction.reply(data.text);
                })
                .catch((error) => {
                    // Handle and display any errors
                    console.error('[ERROR] ', error);
                });
        } else {
            await fetch(`https://uselessfacts.jsph.pl/api/v2/facts/random`)
                .then((response) => response.json())
                .then((data) => {
                    // Process the data and perform actions
                    interaction.reply(data.text);
                })
                .catch((error) => {
                    // Handle and display any errors
                    console.error('[ERROR] ', error);
                });
        }
    },
};
