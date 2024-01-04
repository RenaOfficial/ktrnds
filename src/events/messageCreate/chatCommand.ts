import { Event } from '@/lib/classes/Event';
import { client } from '@/index';
import { Colors } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';

export default new Event('messageCreate', async (message) => {
  const prefix = '.';

  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  ) {
    return;
  }

  const [cmd, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  if (!command.execute.message) {
    return await message.reply({
      embeds: [
        {
          description: 'このコマンドはスラッシュコマンドに対応していません',
          color: Colors.Yellow,
          footer: footer(),
        },
      ],
      allowedMentions: {
        parse: [],
      },
    });
  }

  if (command.isOwnerCommand && message.author.id !== '1004365048887660655') {
    return await message.reply({
      embeds: [
        {
          title: 'エラーが発生しました',
          description: 'このコマンドはBot管理者限定です',
          color: Colors.Red,
          footer: footer(),
        },
      ],
      allowedMentions: {
        parse: [],
      },
    });
  }

  await command.execute.message({ client, message, args });
});
