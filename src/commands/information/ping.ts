import { ApplicationCommandType, Colors } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import { footer } from '@/lib/functions/Embed';
import osu from 'node-os-utils';
import { client } from '@/index';

export default new Command({
  name: 'ping',
  description: "Displays the Bot's ping value.",
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  run: async ({ client, interaction }) => {
    await interaction.followUp({
      embeds: [
        {
          title: '🏓 Pinging...',
          color: Colors.Red,
          footer: footer(),
        },
      ],
    });

    const latency =
      new Date().getTime() - (await interaction.fetchReply()).createdTimestamp;

    const cpuUsage = await osu.cpu.usage();
    const memUsage = (await osu.mem.info()).usedMemPercentage;

    const resources = [
      '--<:ram:1185464482349191168> **RAM: **' + `\`${memUsage}%\``,
      '--<:loading:1185464479107002368> **CPU: **' + `\`${cpuUsage}%\``,
    ];

    const fields = [
      '-<:latency:1185464475692826624> **Latency: **' +
        `\`${client.ws.ping}ms\``,
      '-<:cooldown:1185464473696337940>  **Edit Latency: **' +
        `\`${latency}ms\``,
      `-<:trade:1185464469577535578> **Resources: **\n${resources
        .map((msg) => msg.replace('-', '<:space:1185464484685422652>'))
        .join('\n')}`,
    ];

    await interaction.editReply({
      embeds: [
        {
          title: 'Bot Status:',
          fields: [
            {
              name: '<:shard:1185465377782771852> Shard [0]:',
              value: fields
                .map((msg) => msg.replace('-', '<:space:1185464484685422652>'))
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
