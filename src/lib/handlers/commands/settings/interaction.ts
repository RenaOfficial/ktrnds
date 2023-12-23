import { ChatInputCommandInteraction, Colors, Message } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';
import { replies } from '@/lib/models/replies';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';

export async function interactionSettings({
  interaction,
}: {
  interaction: ChatInputCommandInteraction;
}) {
  const cmd = interaction.options.getSubcommand();
  switch (cmd) {
    case 'reply':
      /* 1は操作の種類(set/del/list)*/
      const type = interaction.options.getString('type');

      const trigger = interaction.options.getString('trigger');
      const reply = interaction.options.getString('reply');

      if (type === 'set') {
        /* 2はトリガー、3は反応 */
        if (!trigger || !reply)
          return await interaction.followUp({
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

        const data = await replies.findOne({ GuildID: interaction.guild?.id });
        if (!data) {
          await replies.create({
            GuildID: interaction.guild?.id,
            Replies: [
              {
                Trigger: trigger,
                Reply: reply,
              },
            ],
          });
        } else {
          data.Replies.push({
            Trigger: trigger,
            Reply: reply,
          });
        }

        return await interaction.followUp({
          embeds: [
            {
              title: '返信機能を登録しました',
              description: `${trigger} => ${reply}`,
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
      return await interaction.followUp({
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
