import { ChatInputCommandInteraction, Colors, Message } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';
import osu from 'node-os-utils';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';
import { client } from '@/index';

async function sendReply({
  data,
}: {
  data: ChatInputCommandInteraction | Message<boolean>;
}) {
  const latency =
    new Date().getTime() -
    (data instanceof ChatInputCommandInteraction
      ? await data.fetchReply()
      : data
    ).createdTimestamp;

  const cpuUsage = await osu.cpu.usage();
  const memUsage = (await osu.mem.info()).usedMemPercentage;

  const resources = [
    '<:space:1185464484685422652><:space:1185464484685422652><:ram:1185464482349191168> **RAM: **' +
      `\`${memUsage}%\``,
    '<:space:1185464484685422652><:space:1185464484685422652><:loading:1185464479107002368> **CPU: **' +
      `\`${cpuUsage}%\``,
  ];

  const fields = [
    '<:space:1185464484685422652><:latency:1185464475692826624> **Latency: **' +
      `\`${client.ws.ping}ms\``,
    '<:space:1185464484685422652><:cooldown:1185464473696337940>  **Edit Latency: **' +
      `\`${latency}ms\``,
    `<:space:1185464484685422652><:trade:1185464469577535578> **Resources: **\n${resources.join(
      '\n'
    )}`,
  ];

  return {
    embeds: [
      {
        title: 'Bot Status:',
        fields: [
          {
            name: '<:shard:1185465377782771852> Shard [0]:',
            value: fields.join('\n'),
          },
        ],
        color: Colors.Aqua,
        footer: footer(),
      },
    ],
    allowedMentions: {
      parse: [],
    },
  };
}

export { sendReply };
