import { Command } from '@/lib/classes/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { replies } from '@/lib/models/replies';
import { footer } from '@/lib/handlers/component/Embed';
import {
  interactionSettings,
  messageSettings,
} from '@/lib/handlers/commands/settings';

export default new Command({
  name: 'settings',
  description: 'Change bot settings',
  options: [
    {
      name: 'reply',
      description: 'Change reply message',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'type',
          description: 'Setting type',
          type: ApplicationCommandOptionType.String,
          choices: [{ name: 'set', value: 'set' }],
          required: true,
        },
        {
          name: 'trigger',
          description: 'Reply trigger',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'reply',
          description: 'Reply message',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
  ],
  slash: async ({ interaction, client }) => {
    await interactionSettings({ interaction });
  },
  chat: async ({ message, client, args }) => {
    await messageSettings({ message, args });
  },
});
