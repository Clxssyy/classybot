const { REST, Routes } = require('discord.js');

require('dotenv').config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// for global commands
rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
  .then(() => console.log('Successfully deleted all application commands.'))
  .catch(console.error);
