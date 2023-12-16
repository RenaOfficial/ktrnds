import { ChatCommand } from '@/lib/classes/ChatCommand';
import { Colors } from 'discord.js';
import { footer } from '@/lib/functions/Embed';
import { client } from '@/index';
import osu from 'node-os-utils';

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
        parse: [],
      },
    });

    const latency = new Date().getTime() - msg.createdTimestamp;

    const cpuUsage = await osu.cpu.usage();
    const memUsage = (await osu.mem.info()).usedMemPercentage;

    const resources = [
      '__<:ram:1185464482349191168> **RAM: **' + `\`${memUsage}%\``,
      '__<:loading:1185464479107002368> **CPU: **' + `\`${cpuUsage}%\``,
    ];

    const fields = [
      '_<:latency:1185464475692826624> **Latency: **' +
        `\`${client.ws.ping}ms\``,
      '_<:cooldown:1185464473696337940>  **Edit Latency: **' +
        `\`${latency}ms\``,
      `_<:trade:1185464469577535578> **Resources: **\n${resources
        .map((msg) => msg.replace(' ', '<:space:1185464484685422652>'))
        .join('\n')}`,
    ];

    await msg.edit({
      embeds: [
        {
          title: 'Bot Status:',
          fields: [
            {
              name: '<:shard:1185465377782771852> Shard [0]:',
              value: fields
                .map((msg) => msg.replace(' ', '<:space:1185464484685422652>'))
                .join('\n'),
            },
          ],
          color: Colors.Aqua,
          footer: footer(),
        },
      ],
    });
  },
});
