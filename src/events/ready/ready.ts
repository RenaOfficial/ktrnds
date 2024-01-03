import { Event } from '@/lib/classes/Event';
import { client } from '@/index';
import { log } from '@/lib/classes/ExtendedClient';

export default new Event('ready', async () => {
  log(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`, 'CLIENT');

  client.user?.setActivity({
    name: `Produced by Rey`,
    state: '/help | Produced by Rey',
    type: 4,
  });
});
