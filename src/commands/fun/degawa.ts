import { Command } from '@/lib/classes/Command';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';

export default new Command({
  name: 'degawa',
  description: 'めっちゃ出川',
  aliases: ["d"],
  execute: {
    interaction: async ({ client, interaction }) => {
      const imageBuffer = (await axios.get('http://degawa.ktrnds.com/random'))
        .data.data

      const base64Data = `data:image/png;base64,${imageBuffer}`
      const image = await loadImage(base64Data);

      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const buffer = canvas.toBuffer('image/png');

      await interaction.followUp({
        files: [
          {
            attachment: buffer,
            name: 'degawa.png',
          },
        ],
      });
    },
    message: async ({ client, message, args }) => {
      const imageBuffer = (await axios.get('http://degawa.ktrnds.com/random'))
        .data.data

      const base64Data = `data:image/png;base64,${imageBuffer}`
      const image = await loadImage(base64Data);

      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const buffer = canvas.toBuffer('image/png');

      await message.reply({
        files: [
          {
            attachment: buffer,
            name: 'degawa.png',
          },
        ],
        allowedMentions: {
          parse: []
        }
      });
    }
  },
});
