import { Command } from '@/lib/classes/Command';
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  Colors,
  ModalBuilder,
  ModalSubmitInteraction,
  PermissionsBitField,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';
import moment from 'moment';

export default new Command({
  name: '予約投稿を設定する',
  type: ApplicationCommandType.Message,
  slash: async ({ client, interaction }) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    const message = interaction.targetMessage;

    const selectMenu = new ChannelSelectMenuBuilder()
      .setPlaceholder('送信するチャンネルを設定')
      .setChannelTypes([ChannelType.GuildText, ChannelType.GuildAnnouncement]);

    const cancelButton = new ButtonBuilder()
      .setLabel('キャンセル')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('cancel');

    await interaction.followUp({
      embeds: [
        {
          description: '予約投稿を設定',
          fields: [
            {
              name: '対象のメッセージ',
              value: `\`\`\`\n${message.content.replace('`', '`')}\n\`\`\``,
            },
          ],
          color: Colors.Green,
          footer: footer(),
        },
      ],
      components: [
        new ActionRowBuilder<
          ChannelSelectMenuBuilder | ButtonBuilder
        >().addComponents(selectMenu, cancelButton),
      ],
    });

    const collector = (
      await interaction.fetchReply()
    ).createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60 * 1000 * 5,
    });

    let channel: string;
    let targetDate: Date;

    collector.on('collect', async (i) => {
      if (!i.isChannelSelectMenu()) {
        const button = new ButtonBuilder()
          .setLabel('投稿時間を設定')
          .setStyle(ButtonStyle.Success)
          .setCustomId('settings');

        if (
          !i.channel ||
          !(
            i.channel.type === ChannelType.GuildAnnouncement ||
            i.channel.type === ChannelType.GuildText
          )
        )
          return;

        if (
          !i.channel
            .permissionsFor(i.user.id)
            ?.has(PermissionsBitField.Flags.SendMessages)
        ) {
          await i.update({
            embeds: [
              {
                description: 'チャンネルでメッセージを送信する権限がありません',
                color: Colors.Red,
                footer: footer(),
              },
            ],
          });
        } else {
          channel = i.channel.id;

          i.update({
            embeds: [
              {
                description: '予約投稿を設定',
                fields: [
                  {
                    name: '対象のメッセージ',
                    value: `\`\`\`\n${message.content.replace(
                      '`',
                      '`'
                    )}\n\`\`\``,
                  },
                  {
                    name: '送信するチャンネル',
                    value: `<#${channel}>`,
                  },
                ],
                color: Colors.Green,
                footer: footer(),
              },
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                button,
                cancelButton
              ),
            ],
          });
        }
      }

      if (i.isButton()) {
        if (i.customId === 'cancel') await i.message.delete();
        if (i.customId === 'settings') {
          const modal = new ModalBuilder()
            .setTitle('投稿時刻を設定')
            .addComponents(
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setLabel('投稿時刻')
                  .setPlaceholder('YYYY/MM/DD/hh:mm:ss')
                  .setStyle(TextInputStyle.Short)
                  .setRequired()
                  .setCustomId('time')
              )
            );

          await i.showModal(modal);

          const isSubmit = await i.awaitModalSubmit({
            time: 60 * 1000 * 5,
          });

          if (isSubmit) {
            const time = isSubmit.fields.getTextInputValue('time');

            if (
              !time.match(
                /[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[0-9]{2}:[0-9]{2}:[0-9]{2}/
              )
            ) {
              await isSubmit.reply(
                '`YYYY/MM/DD/hh:mm:ss`形式で入力してください'
              );
            } else {
              let [year, month, date, times] = time.split('/');
              const [hour, minutes, seconds] = time.split(':');

              const target = moment(
                `${year}-${month}-${date}T${hour}-${minutes}-${seconds}`
              );
              const now = moment();

              if (target.isValid()) {
                await isSubmit.reply('エラーが発生しました');
              } else {
                if (target.isBefore(now)) {
                  await isSubmit.reply('未来の時刻を入力してください');
                } else {
                  if (now.diff(target, 'seconds') > 7 * 24 * 60 * 60) {
                    await isSubmit.reply('7日以内で指定してください');
                  } else {
                    targetDate = target.toDate();
                    await isSubmit.reply('設定しました');

                    const button = new ButtonBuilder()
                      .setLabel('設定')
                      .setCustomId('save')
                      .setStyle(ButtonStyle.Success);

                    i.update({
                      embeds: [
                        {
                          description: '予約投稿を設定',
                          fields: [
                            {
                              name: '対象のメッセージ',
                              value: `\`\`\`\n${message.content.replace(
                                '`',
                                '`'
                              )}\n\`\`\``,
                            },
                            {
                              name: '送信するチャンネル',
                              value: `<#${channel}>`,
                            },
                            {
                              name: '設定日時',
                              value: moment(targetDate).format(
                                'YYYY年MM月DD日 hh時mm分ss秒'
                              ),
                              inline: true,
                            },
                          ],
                          color: Colors.Green,
                          footer: footer(),
                        },
                      ],
                      components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                          button,
                          cancelButton
                        ),
                      ],
                    });
                  }
                }
              }
            }
          }
        }

        if (i.customId === 'save') {
          client.promises.set(targetDate, {
            message: message.content,
            channel: channel,
          });

          i.update({
            embeds: [
              {
                description: '予約投稿を設定しました',
                fields: [
                  {
                    name: '対象のメッセージ',
                    value: `\`\`\`\n${message.content.replace(
                      '`',
                      '`'
                    )}\n\`\`\``,
                  },
                  {
                    name: '送信するチャンネル',
                    value: `<#${channel}>`,
                  },
                  {
                    name: '設定日時',
                    value: moment(targetDate).format(
                      'YYYY年MM月DD日 hh時mm分ss秒'
                    ),
                    inline: true,
                  },
                ],
                color: Colors.Aqua,
                footer: footer(),
              },
            ],
            components: [],
          });
        }
      }
    });

    collector.on('end', async () => {
      await interaction.deleteReply();
    });
  },
  chat: () => {},
});
