import { Command } from '@/lib/classes/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { exec } from 'child_process';
import { footer } from '@/lib/handlers/component/Embed';

export default new Command({
  name: 'reload',
  description: 'Botの機能を再読み込みします',
  isOwnerCommand: true,
  options: [
    {
      name: 'event',
      description: 'イベントファイルをリロードします',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'all',
      description: 'Botを再起動します',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  slash: async ({ client, interaction }) => {
    const cmd = interaction.options.getSubcommand();

    switch (cmd) {
      case 'event':
        await client.loadEvents();

        await interaction.followUp({
          embeds: [
            {
              title:
                '<:check:1190622673999503390> イベントを再読み込みしました',
              color: Colors.Aqua,
              footer: footer(),
            },
          ],
        });
        break;
      case 'all':
        await interaction.followUp({
          embeds: [
            {
              title: '<:check:1190622673999503390> Botを再起動します',
              color: Colors.Purple,
              footer: footer(),
            },
          ],
        });

        exec('pm2 restart ktrnds');
    }
  },
  chat: async ({ client, message, args }) => {
    if (!args[0] || (args[0] !== 'event' && args[0] !== 'all'))
      return message.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '必要なパラメーターを指定してください',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });

    if (args[0] === 'event') {
      await client.loadEvents();

      await message.reply({
        embeds: [
          {
            title: '<:check:1190622673999503390> イベントを再読み込みしました',
            color: Colors.Aqua,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    } else if (args[0] === 'all') {
      await message.reply({
        embeds: [
          {
            title: '<:check:1190622673999503390> Botを再起動します',
            color: Colors.Purple,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });

      exec('pm2 restart ktrnds');
    }
  },
});
