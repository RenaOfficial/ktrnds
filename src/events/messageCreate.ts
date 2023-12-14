import { Event } from '../lib/classes/Event';
import { client } from '../index';

export default new Event('messageCreate', async (message) => {
  const prefix = '.';

  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  )
    return;

  const [cmd, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const command = client.chatCommands.get(cmd.toLowerCase());

  if (!command) return;
  await command.run({ client, message, args });
});
