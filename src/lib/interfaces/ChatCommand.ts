import { Message } from 'discord.js';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';

interface RunOptions {
  client: ExtendedClient;
  message: Message;
  args: string[];
}

export type ChatCommandType = {
  name: string;
  aliases?: string[];
  run: (options: RunOptions) => any;
};
