import { Command } from '@/lib/classes/Command';
import axios from 'axios';
import { ApplicationCommandType, Colors } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';

export default new Command({
  name: 'Make it a Quote',
  type: ApplicationCommandType.Message,
  slash: async ({ client, interaction }) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    await interaction.reply({
      embeds: [
        {
          title: '生成中',
          color: Colors.Blue,
          footer: footer(),
        },
      ],
    });

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

    await interaction.editReply({
      content: `[生成元のメッセージ](${interaction.targetMessage.url})`,
      embeds: [
        {
          title: '生成完了',
          image: {
            url: response.url,
          },
          color: Colors.Aqua,
          footer: footer(),
        },
      ],
    });
  },
  chat: async () => {},
});
