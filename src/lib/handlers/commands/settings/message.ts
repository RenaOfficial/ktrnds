import { Colors, Message } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';
import { replies } from '@/lib/models/replies';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';

export async function messageSettings({
  message,
  args,
}: {
  message: Message<boolean>;
  args: string[];
}) {
  switch (args[0]) {
    case 'reply':
      /* 1は操作の種類(set/del/list)*/
      if (args[1] === 'set') {
        /* 2はトリガー、3は反応 */
        if (!args[2] || !args[3])
          return await message.reply({
            embeds: [
              {
                title: 'エラーが発生しました',
                description: 'パラメーターが不足しています',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            allowedMentions: {
              parse: [],
            },
          });
        const data = await replies.findOne({ GuildID: message.guild?.id });
        if (!data) {
          await replies.create({
            GuildID: message.guild?.id,
            Replies: [
              {
                Trigger: args[2],
                Reply: args[3],
              },
            ],
          });
        } else {
          data.Replies.push({
            Trigger: args[2],
            Reply: args[3],
          });
        }

        return await message.reply({
          embeds: [
            {
              title: '返信機能を登録しました',
              description: `${args[2]} => ${args[3]}`,
              color: Colors.Aqua,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });
      }
      break;
    default:
      return await message.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: 'そのような設定項目はありません',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
  }
}
