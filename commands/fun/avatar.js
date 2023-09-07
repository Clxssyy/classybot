const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const path = require('node:path');
const fs = require('node:fs');

// Load in all the image files
const backgroundsPath = path.join(__dirname, '/images/Background');
const backgrounds = fs
  .readdirSync(backgroundsPath)
  .filter((file) => file.endsWith('.png'));

const propsPath = path.join(__dirname, '/images/Props');
const props = fs.readdirSync(propsPath).filter((file) => file.endsWith('.png'));

const colorsPath = path.join(__dirname, '/images/Color');
const colors = fs
  .readdirSync(colorsPath)
  .filter((file) => file.endsWith('.png'));

const eyesPath = path.join(__dirname, '/images/Eyes');
const eyes = fs.readdirSync(eyesPath).filter((file) => file.endsWith('.png'));

const pupilsPath = path.join(__dirname, '/images/Pupils');
const pupils = fs
  .readdirSync(pupilsPath)
  .filter((file) => file.endsWith('.png'));

const mouthsPath = path.join(__dirname, '/images/Mouth');
const mouths = fs
  .readdirSync(mouthsPath)
  .filter((file) => file.endsWith('.png'));

const accessoriesPath = path.join(__dirname, '/images/Accessories');
const accessories = fs
  .readdirSync(accessoriesPath)
  .filter((file) => file.endsWith('.png'));

console.log('[Avatar] Images loaded.');

async function generate(interaction, reload) {
  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext('2d');

  if (reload) {
    const backgroundsPath = path.join(__dirname, '/images/Background');
    const backgrounds = fs
      .readdirSync(backgroundsPath)
      .filter((file) => file.endsWith('.png'));

    const propsPath = path.join(__dirname, '/images/Props');
    const props = fs
      .readdirSync(propsPath)
      .filter((file) => file.endsWith('.png'));

    const colorsPath = path.join(__dirname, '/images/Color');
    const colors = fs
      .readdirSync(colorsPath)
      .filter((file) => file.endsWith('.png'));

    const eyesPath = path.join(__dirname, '/images/Eyes');
    const eyes = fs
      .readdirSync(eyesPath)
      .filter((file) => file.endsWith('.png'));

    const pupilsPath = path.join(__dirname, '/images/Pupils');
    const pupils = fs
      .readdirSync(pupilsPath)
      .filter((file) => file.endsWith('.png'));

    const mouthsPath = path.join(__dirname, '/images/Mouth');
    const mouths = fs
      .readdirSync(mouthsPath)
      .filter((file) => file.endsWith('.png'));

    const accessoriesPath = path.join(__dirname, '/images/Accessories');
    const accessories = fs
      .readdirSync(accessoriesPath)
      .filter((file) => file.endsWith('.png'));

    console.log('[Avatar] Images reloaded.');
  }

  // Randomly pick each attribute
  const background =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const prop = props[Math.floor(Math.random() * props.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const eye = eyes[Math.floor(Math.random() * eyes.length)];
  const pupil = pupils[Math.floor(Math.random() * pupils.length)];
  const mouth = mouths[Math.floor(Math.random() * mouths.length)];
  const accessory = accessories[Math.floor(Math.random() * accessories.length)];

  // Path to randomly selected images
  const backgroundPath = path.join(backgroundsPath, background);
  const propPath = path.join(propsPath, prop);
  const colorPath = path.join(colorsPath, color);
  const eyePath = path.join(eyesPath, eye);
  const pupilPath = path.join(pupilsPath, pupil);
  const mouthPath = path.join(mouthsPath, mouth);
  const accessoryPath = path.join(accessoriesPath, accessory);

  // Load images
  async function loadImages() {
    const first = await Canvas.loadImage(backgroundPath);
    const second = await Canvas.loadImage(propPath);
    const third = await Canvas.loadImage(colorPath);
    const fourth = await Canvas.loadImage(eyePath);
    const fifth = await Canvas.loadImage(pupilPath);
    const sixth = await Canvas.loadImage(mouthPath);
    const seventh = await Canvas.loadImage(accessoryPath);

    ctx.drawImage(first, 0, 0, 640, 360);
    ctx.drawImage(second, 0, 0, 640, 360);
    ctx.drawImage(third, 0, 0, 640, 360);
    ctx.drawImage(fourth, 0, 0, 640, 360);
    ctx.drawImage(fifth, 0, 0, 640, 360);
    ctx.drawImage(sixth, 0, 0, 640, 360);
    ctx.drawImage(seventh, 0, 0, 640, 360);
  }

  await loadImages();

  const avatarURL = canvas.toDataURL();
  const avatarData = avatarURL.replace(/^data:image\/png;base64,/, '');
  const avatarBuffer = Buffer.from(avatarData, 'base64');
  const avatarID = Date.now();

  // Save the avatar
  const directory = './commands/fun/avatars';
  const filename = `avatar-${avatarID}.png`;
  const filePath = path.join(directory, filename);

  await fs.writeFile(filePath, avatarBuffer, (error) => {
    if (error) {
      console.log(error);
    }
    console.log(`[Avatar] Avatar saved as ${filename}`);
  });

  // Send generated avatar
  const attachment = new AttachmentBuilder(await canvas.encode('png'), {
    name: 'avatar.png',
  });
  await interaction.reply({ files: [attachment] });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Generates a random avatar!')
    .addStringOption((option) =>
      option
        .setName('reload')
        .setDescription(
          'Choose to reload attribute images if new images have been added (default: false)'
        )
        .addChoices(
          { name: 'true', value: 'true' },
          { name: 'false', value: 'false' }
        )
    ),
  async execute(interaction) {
    if (interaction.options.getString('reload')) {
      await generate(interaction, interaction.options.getString('reload'));
    } else {
      await generate(interaction, false);
    }
  },
};
