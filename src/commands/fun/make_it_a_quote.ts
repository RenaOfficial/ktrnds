import { Command } from '@/lib/classes/Command';
import axios from 'axios';
import { ApplicationCommandType, Colors } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';
import { unlinkSync, writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import sharp from 'sharp';

export default new Command({
  name: 'Make it a Quote',
  type: ApplicationCommandType.Message,
  slash: async ({ client, interaction }) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    if (!interaction.targetMessage) {
      return await interaction.followUp({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: 'そのメッセージにはテキストが含まれていません',
            color: Colors.Red,
            footer: footer(),
          },
        ],
      });
    }

    const response = (
      await axios.post('https://api.voids.top/fakequote', {
        text: interaction.targetMessage.content,
        avatar: interaction.targetMessage.author.avatarURL(),
        username: interaction.targetMessage.author.tag,
        display_name: interaction.targetMessage.author.displayName,
        color: true,
        watermark: 'Powered by Paicha',
      })
    ).data;

    const imageBinary: ArrayBuffer = (
      await axios.get(response.url, {
        responseType: 'arraybuffer',
      })
    ).data;

    const filePath = response.url;
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    fileName.replace('?', '');

    const resizedImage = await sharp(imageBinary).resize(1920, 1080).toBuffer();

    writeFileSync(`${__dirname}/../../images/quote/${fileName}`, resizedImage);

    const file = await readFile(`${__dirname}/../../images/quote/${fileName}`);

    await interaction.followUp({
      content: `[生成元のメッセージ](${interaction.targetMessage.url})`,
      embeds: [],
      files: [
        {
          attachment: file,
          name: 'quote.jpg',
        },
      ],
    });

    unlinkSync(`${__dirname}/../../images/quote/${fileName}`);
  },
  chat: async () => {},
});
