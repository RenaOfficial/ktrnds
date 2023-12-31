import { Command } from '@/lib/classes/Command';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Colors,
} from 'discord.js';
import { interactionSnipe, messageSnipe } from '@/lib/handlers/commands/snipe';

export default new Command({
  name: 'snipe',
  description:
    '編集/削除されたメッセージを取得し、表示します。パラメーターに"e"を含むと編集したメッセージを表示します',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'snipe_type',
      description: 'Snipe Type',
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: 'Delete', value: 'd' },
        { name: 'Edit', value: 'e' },
      ],
    },
  ],
  aliases: ['s'],
  slash: async ({ client, interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    const args = interaction.options.getString('snipe_type');
    const argument = args ? 'e' : 'd';

    return await interactionSnipe({ argument, interaction });
  },
  chat: async ({ client, message, args }) => {
    const argument = args[0] ? (args[0] === 'e' ? 'e' : 'd') : 'd';
    return await messageSnipe({ argument, message });
  },
});
