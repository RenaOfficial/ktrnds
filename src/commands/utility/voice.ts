import { Command } from '@/lib/classes/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';

export default new Command({
  name: 'voice',
  description: '読み上げを開始します',
  options: [
    {
      name: 'join',
      description: '読み上げを開始します',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'leave',
      description: '読み上げを終了します',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  slash: async ({ client, interaction }) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = interaction.options.getSubcommand();
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    if (!member) return;

    const memberVC = member.voice.channel;

    switch (cmd) {
      case 'join':
        if (!memberVC) {
          return await interaction.followUp({
            embeds: [
              {
                title: 'エラーが発生しました',
                description: '接続先のVCが存在しません',
                color: Colors.Red,
                footer: footer(),
              },
            ],
          });
        }
        break;
    }
  },
  chat: () => {},
});
