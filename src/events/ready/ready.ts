import { Event } from '@/lib/classes/Event';
import { client } from '@/index';

export default new Event('ready', async () => {
  console.log(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`);

  client.user?.setActivity({
    name: `Produced by Rey`,
    state: '/help | Produced by Rey',
    type: 4,
  });
});
