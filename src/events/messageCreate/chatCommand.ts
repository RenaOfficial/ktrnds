import { Event } from '@/lib/classes/Event';
import { client } from '@/index';

export default new Event('messageCreate', async (message) => {
  const prefix = '.';

  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  ) {
    return;
  }

  const [cmd, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command || !command.chat) return;

  await command.chat({ client, message, args });
});
