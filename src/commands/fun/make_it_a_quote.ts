import { Command } from '@/lib/classes/Command';
import axios from 'axios';
import { ApplicationCommandType, Colors } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';

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
        avatar: interaction.targetMessage.author.displayAvatarURL(),
        username: interaction.targetMessage.author.tag,
        display_name: interaction.targetMessage.author.displayName,
        color: true,
        watermark: 'Powered by Paicha',
      })
    ).data;

    const imageBuffer = await axios.get(response.url, {
      responseType: 'arraybuffer',
    });

    const imageBinary = Buffer.from(imageBuffer.data, 'binary');

    await interaction.followUp({
      content: `[生成元のメッセージ](${interaction.targetMessage.url})`,
      embeds: [],
      files: [
        {
          attachment: imageBinary,
          name: 'quote.jpg',
        },
      ],
    });
  },
  chat: async () => {},
});
