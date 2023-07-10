const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai-image')
        .setDescription(
            'Sends a prompt to OpenAI to generate a realistic image.'
        )
        .addStringOption((option) =>
            option
                .setName('prompt')
                .setDescription('Choose what to generate.')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('size')
                .setDescription('Choose size of image.')
                .setRequired(true)
                .addChoices(
                    { name: 'small', value: '256x256' },
                    { name: 'medium', value: '512x512' },
                    { name: 'large', value: '1024x1024' }
                )
        ),
    async execute(interaction) {
        try {
            const prompt = interaction.options.getString('prompt');

            // Check if command was sent in a guild channel or in a DM
            const inGuild = interaction.inGuild();

            // Send initial message
            if (inGuild) {
                await interaction.reply(
                    `Prompt: ${prompt}\nGenerating Image and sending it to your DMs and in here!`
                );
            } else {
                await interaction.reply(
                    `Prompt: ${prompt}\nGenerating Image and sending it here!`
                );
            }

            // OpenAI Image generation
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_TOKEN,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createImage({
                prompt: prompt,
                n: 1,
                size: interaction.options.getString('size'),
                response_format: 'b64_json',
            });
            const imageData = response.data.data[0].b64_json;
            const imageID = response.data.created;
            const imageBuffer = Buffer.from(imageData, 'base64');

            // Save the image buffer to a file
            const directory = './commands/ai/images';
            const filename = `generated_image${imageID}.png`;
            const filePath = path.join(directory, filename);

            fs.writeFile(filePath, imageBuffer, (error) => {
                if (error) {
                    throw error;
                }
                console.log(`[AI-Image] Image saved as ${filename}`);
            });

            // Create generated image attachment
            const attachment = new AttachmentBuilder(imageBuffer, {
                name: 'generated_image.png',
            });

            // Create embed
            const embed = new EmbedBuilder()
                .setColor(0x6ab7dd)
                .setTitle(`${interaction.user.username}'s Generated Image`)
                .setImage('attachment://generated_image.png')
                .setDescription(`Prompt: ${prompt}`);

            // Send generated image
            if (inGuild) {
                await interaction.user.createDM();
                await interaction.user.dmChannel.send({
                    embeds: [embed],
                    files: [attachment],
                });
                await interaction.editReply({
                    content: '',
                    embeds: [embed],
                    files: [attachment],
                });
            } else {
                await interaction.editReply({
                    content: '',
                    embeds: [embed],
                    files: [attachment],
                });
            }
        } catch (error) {
            console.error('[ERROR - AI_IMAGE]', error);
        }
    },
};
