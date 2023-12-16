import { ChatCommand } from '@/lib/classes/ChatCommand';
import { Colors } from 'discord.js';

export default new ChatCommand({
  name: 'snipe',
  run: async ({ client, message, args }) => {
    if (!args[0] || args[0] !== 'e') {
      const sniped_message = client.snipes.get(message.channel.id);
      if (!sniped_message) {
        return message.reply('スナイプするメッセージがありません');
      }
      return message.reply({
        embeds: [
          {
            author: {
              name: `${
                sniped_message.author?.displayName || ''
              }(${sniped_message.author?.tag})`,
              icon_url: sniped_message.author?.avatarURL()?.toString() || '',
            },
            description: `${sniped_message.content}`,
            timestamp: new Date(sniped_message.createdTimestamp).toISOString(),
            color: Colors.Aqua,
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    } else {
      const snipe = client.edit_snipes.get(message.channel.id);
      if (!snipe) {
        return message.reply('スナイプするメッセージがありません');
      }
      return message.reply({
        embeds: [
          {
            author: {
              name: `${snipe.newMessage.author?.displayName || ''}(${snipe
                .newMessage.author?.tag})`,
              icon_url: snipe.newMessage.author?.avatarURL()?.toString() || '',
            },
            description: `${snipe.oldMessage.content} => ${snipe.newMessage.content}`,
            timestamp: new Date(
              snipe.newMessage.createdTimestamp
            ).toISOString(),
            color: Colors.Yellow,
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    }
  },
});
