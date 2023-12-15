import { ChatInputApplicationCommandData, Message } from 'discord.js';
import { ExtendedClient } from '../classes/ExtendedClient';

interface RunOptions {
  client: ExtendedClient;
  message: Message;
  args: string[];
}

export type ChatCommandType = {
  name: string;
  run: (options: RunOptions) => any;
};
