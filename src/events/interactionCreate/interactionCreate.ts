import {
  ChatInputCommandInteraction,
  Colors,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { client } from '@/index';
import { Event } from '@/lib/classes/Event';
import { footer } from '@/lib/handlers/component/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return await interaction.reply({
        embeds: [
          {
            title: '予期せぬエラーが発生しました',
            color: Colors.Red,
            footer: footer(),
          },
        ],
      });
    }

    if (
      command.isOwnerCommand &&
      interaction.user.id !== '1004365048887660655'
    ) {
      return await interaction.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: 'このコマンドはBot管理者限定です',
            color: Colors.Red,
            footer: footer(),
          },
        ],
      });
    }

    await interaction.deferReply({
      ephemeral: command?.ephemeral || false,
    });

    await command.slash({
      client,
      interaction: interaction as ChatInputCommandInteraction,
    });
  }
});
