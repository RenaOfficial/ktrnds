import { ChatCommand } from '@/lib/classes/ChatCommand';
import { Colors } from 'discord.js';
import { footer } from '@/lib/functions/Embed';
import { client } from '@/index';

export default new ChatCommand({
  name: 'ping',
  run: async ({ message }) => {
    const msg = await message.reply({
      embeds: [
        {
          title: '🏓 Pinging...',
          color: Colors.Red,
          footer: footer(),
        },
      ],
      allowedMentions: {
        parse: []
      }
    })

    const latency = new Date().getTime() - msg.createdTimestamp;

    await msg.edit({
      embeds: [
        {
          title: '🏓 Pong!',
          description: `Client Latency: ${client.ws.ping}ms\nMessage Edit Latency: ${latency}ms`,
          color: Colors.Aqua,
          footer: footer(),
        },
      ],
    })
  },
});
