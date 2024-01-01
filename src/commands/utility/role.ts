import { Command } from '@/lib/classes/Command';
import { Colors } from 'discord.js';
import { footer } from '@/lib/handlers/component/Embed';

export default new Command({
  name: 'role',
  description: 'ロールを管理します',
  slash: async ({ interaction }) => {
    return await interaction.followUp({
      embeds: [
        {
          description: 'このコマンドはスラッシュコマンドに対応してません',
          color: Colors.Blurple,
          footer: footer(),
        },
      ],
    });
  },
  chat: async ({ client, message, args }) => {
    if (args[0] === 'give') {
      const roles = message.mentions.roles;
      const members = message.mentions.members;

      if (!roles || !members) {
        return await message.reply({
          embeds: [
            {
              description: 'パラメーターを指定してください',
              color: Colors.Red,
              footer: footer(),
            },
          ],
        });
      }

      const log: string[] = [];

      members?.forEach((member) => {
        roles.forEach((role) => {
          const guildMember = message.guild?.members.cache.get(member.id);

          guildMember?.roles
            .add(role.id)
            .catch(() => {
              log.push(
                `${member.displayName}に${role.name}の付与中にエラーが発生しました`
              );
            })
            .then(() => {
              log.push(
                `${member.displayName}に${role.name}の付与に成功しました`
              );
            });
        });
      });

      await message.reply({
        embeds: [
          {
            title: '処理が終了しました',
            description: `\`\`\`\n${log.join('\n')}\n\`\`\``,
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    }
  },
});
