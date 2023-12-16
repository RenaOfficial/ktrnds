import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../classes/ExtendedClient';

interface RunOptions {
  client: ExtendedClient;
  interaction: ChatInputCommandInteraction;
  args: CommandInteractionOptionResolver;
}

export type CommandType = ChatInputApplicationCommandData & {
  userPermissions?: PermissionResolvable[];
  ephemeral?: boolean;
  run: (options: RunOptions) => any;
};
