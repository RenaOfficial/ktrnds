import { ChatCommand } from '@/lib/classes/ChatCommand';

export default new ChatCommand({
  name: 'ping',
  run: ({ message }) => {
    message.reply('pong');
  },
});
