import { ApplicationCommandType, Colors } from 'discord.js';
import { Command } from '../../lib/classes/Command';
import { footer } from '../../lib/functions/Embed';

export default new Command({
  name: 'ping',
  description: "Displays the bot's ping value.",
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  run: async ({ client, interaction }) => {
    await interaction.followUp({
      embeds: [
        {
          title: '🏓 Pinging...',
          color: Colors.Red,
          footer: footer(),
        },
      ],
    });

    const ratency = new Date().getTime() - interaction.createdTimestamp;

    await interaction.editReply({
      embeds: [
        {
          title: '🏓 Pong!',
          description: `Client ratency: ${client.ws.ping}ms\nMessage Edit ratency: ${ratency}ms`,
          color: Colors.Aqua,
          footer: footer(),
        },
      ],
    });
  },
});
