import { Event } from '@/lib/classes/Event';
import { ready } from '@/lib/functions/ready';

export default new Event('ready', async () => {
  ready();
});
