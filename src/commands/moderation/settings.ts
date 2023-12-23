import { Command } from '@/lib/classes/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { replies } from '@/lib/models/replies';
import { footer } from '@/lib/handlers/component/Embed';

export default new Command({
  name: 'settings',
  description: 'Change bot settings',
  options: [
    {
      name: 'type',
      description: 'Setting type',
      type: ApplicationCommandOptionType.String,
      choices: [{ name: 'Reply', value: 'reply' }],
    },
  ],
  chat: async ({ message, client, args }) => {
    /* argsについて */
    /* 0は設定の種類 */
    if (!args[0])
      return await message.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '設定の種類を指定してください',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    
    switch (args[0]) {
      case 'reply':
        /* 1は操作の種類(set/del/list)*/
        if (!args[1]) return;

        if (args[1] === 'set') {
          /* 2はトリガー、3は反応 */
          if (!args[2] || !args[3]) return;
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
                description: `**${args[2]} => ${args[3]}**`,
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
  },
});
