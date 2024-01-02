import { Command } from '@/lib/classes/Command';

export default new Command({
  name: 'server',
  description: 'サーバー情報を表示します',
  slash: async ({ client, interaction }) => {},
  chat: async ({ client, message, args }) => {},
});
