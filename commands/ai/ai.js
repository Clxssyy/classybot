const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Sends a prompt to openai.')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('Choose what to say to the ai.')
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    try {
      const prompt = await interaction.options.getString('prompt');
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_TOKEN,
      });

      await interaction.reply(`Starting AI session with prompt: ${prompt}`);
      const conversation = [
        {
          role: 'system',
          content: 'You are a helpful assistant named ClassyBot',
        },
        { role: 'user', content: prompt },
      ];

      const filter = (response) => {
        return response.author.id === interaction.user.id;
      };

      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversation,
        max_tokens: 1000,
      });

      await interaction
        .editReply({
          content: `Session Started\nUser: ${interaction.user.username}\nPrompt: ${prompt}\nResponse: ${response.data.choices[0].message.content}`,
          fetchReply: true,
        })
        .then(async (message) => {
          const thread = await message.startThread({
            name: prompt,
            reason: 'AI command was called.',
          });

          const collector = thread.createMessageCollector({
            filter: filter,
            idle: 60000,
          });

          collector.on('collect', async (message) => {
            await conversation.push({
              role: 'user',
              content: message.content,
            });

            const response = await openai.createChatCompletion({
              model: 'gpt-3.5-turbo',
              messages: conversation,
              max_tokens: 1000,
            });

            await conversation.push({
              role: 'assistant',
              content: response.data.choices[0].message.content,
            });

            await thread.send(response.data.choices[0].message.content);
          });

          collector.on('end', async (collected) => {
            await thread.send(
              `Session Ended\nUser: ${interaction.user.username}\nPrompt: ${prompt}\nReason: ${collector.endReason}`
            );

            await thread.setLocked(true);
          });
        });
    } catch (error) {
      console.error('[ERROR - AI] ', error);
    }
  },
};
