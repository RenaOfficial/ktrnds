import { APIEmbed, Colors, EmbedBuilder, Message } from 'discord.js';
import { client } from '@/index';
import { footer } from '@/lib/handlers/component/Embed';

export async function messageSnipe({
  argument,
  message,
}: {
  argument: 'e' | 'd';
  message: Message<boolean>;
}) {
  if (argument !== 'e') {
    const sniped_message = client.snipes.get(message.channel.id);
    if (!sniped_message) {
      return await message.reply({
        embeds: [
          {
            description: 'スナイプするメッセージがありません',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    }

    const attachments = sniped_message.attachments.size
      ? sniped_message.attachments.map((attachment) => attachment.proxyURL)
      : undefined;

    const embeds: APIEmbed[] = [
      {
        author: {
          name: `${sniped_message.author?.displayName || ''}(${sniped_message
            .author?.tag})`,
          icon_url: sniped_message.author?.avatarURL()?.toString() || '',
        },
        description: `${sniped_message.content}`,
        timestamp: new Date(sniped_message.createdTimestamp).toISOString(),
        color: Colors.Aqua,
      },
    ];

    attachments?.forEach((attachment) => {
      embeds.push({
        image: {
          url: attachment,
        },
        color: Colors.Aqua,
      });
    });

    return await message.reply({
      embeds: embeds,
      allowedMentions: {
        parse: [],
      },
    });
  } else {
    const snipe = client.edit_snipes.get(message.channel.id);
    if (!snipe) {
      return await message.reply({
        embeds: [
          {
            description: 'スナイプするメッセージがありません',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    }
    return await message.reply({
      embeds: [
        {
          author: {
            name: `${snipe.newMessage.author?.displayName || ''}(${snipe
              .newMessage.author?.tag})`,
            icon_url: snipe.newMessage.author?.avatarURL()?.toString() || '',
          },
          description: `${snipe.oldMessage.content} => ${snipe.newMessage.content}`,
          timestamp: new Date(snipe.newMessage.createdTimestamp).toISOString(),
          color: Colors.Yellow,
        },
      ],
      allowedMentions: {
        parse: [],
      },
    });
  }
}
