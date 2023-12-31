import {
  ApplicationCommandData,
  CommandInteraction,
  Message,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';

interface SlashCommandRunOptions {
  client: ExtendedClient;
  interaction: CommandInteraction;
}

interface ChatCommandRunOptions {
  client: ExtendedClient;
  message: Message;
  args: string[];
}

export type CommandType = ApplicationCommandData & {
  userPermissions?: PermissionResolvable[];
  ephemeral?: boolean;
  aliases?: string[];
  isOwnerCommand?: boolean;
  slash: (options: SlashCommandRunOptions) => any;
  chat: (options: ChatCommandRunOptions) => any;
};
