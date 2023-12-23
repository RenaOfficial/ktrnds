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

    if (
      !command ||
      !command.slash ||
      !interaction.channel ||
      !interaction.guild
    ) {
      return await interaction.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description:
              '実行したコマンドはスラッシュコマンドに対応していません',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply({
      ephemeral: command.ephemeral || false,
    });

    await command.slash({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ChatInputCommandInteraction,
    });
  }
});
