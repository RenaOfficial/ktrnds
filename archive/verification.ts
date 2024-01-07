import { Command } from '../src/lib/classes/Command';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  codeBlock,
  Colors,
} from 'discord.js';
import { footer } from '../src/lib/handlers/component/Embed';
import Schema from '../src/lib/models/webCaptcha';

export default new Command({
  name: 'verification',
  description: 'ユーザーの検証を行います',
  options: [
    {
      name: 'role',
      description: '@Role',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const role = interaction.options.getRole('role');

      const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('web_verify')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
          .setLabel('クリックして認証リンクを表示')
      );

      await interaction.followUp({
        components: [button],
        embeds: [
          {
            title: 'Web認証',
            description: codeBlock(
              '下のボタンをクリックして認証してください\n' +
                '認証ができない場合はサーバー管理者、またはBot管理者にお問い合わせください。'
            ),
            fields: [
              {
                name: '\u200b',
                value: `認証完了後、<@&${role?.id}>が付与されます`,
              },
            ],
            footer: footer(),
            color: Colors.Aqua,
            image: {
              url: 'https://cdn.discordapp.com/attachments/1193618166421671937/1193624921436332032/image.jpg',
            },
          },
        ],
      });

      await Schema.findOneAndUpdate(
        { MessageID: (await interaction.fetchReply()).id },
        { RoleID: role?.id, GuildID: interaction.guild?.id },
        { new: true, upsert: true }
      );
    },
  },
});
