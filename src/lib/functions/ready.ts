import { client } from '@/index';
import { ActivityType } from 'discord.js';

export function ready() {
  console.log(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`);

  client.user?.setActivity({
    name: `Produced by Rey`,
    type: ActivityType.Playing,
  });
}
