import { Event } from '../lib/classes/Event';
import { client } from '../index';
import { ActivityType } from 'discord.js';

export default new Event('ready', async () => {
  console.log(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`);
  console.log(client.chatCommands.map((cmd) => cmd.name).join(", "))

  client.user?.setActivity({
    name: `Produced by Rey`,
    type: ActivityType.Playing,
  });
});
