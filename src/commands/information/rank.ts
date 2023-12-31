import { Command } from '../../lib/classes/Command';
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  Colors,
} from 'discord.js';
import Level from '../../lib/models/level';
import canvacord from 'canvacord';
import { footer } from '../../lib/handlers/component/Embed';

export default new Command({
  name: 'rank',
  description: 'ユーザーのレベルを表示します',
  aliases: ['level'],
  options: [
    {
      name: 'target',
      description: '@user',
      type: ApplicationCommandOptionType.User,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.isChatInputCommand()) return;
      if (!interaction.guild) {
        return await interaction.followUp({
          content: 'このコマンドはサーバー内でのみ実行可能です',
        });
      }

      const targetUserId =
        interaction.options.getUser('target') || interaction.user.id;
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      const fetchedLevel = await Level.findOne({
        UserID: targetUserId,
        GuildID: interaction.guild.id,
      });

      const rank = new canvacord.Rank()
        .setAvatar(targetUser.user.displayAvatarURL({ size: 256 }))
        .setLevel(fetchedLevel?.Level || 1)
        .setCurrentXP(fetchedLevel?.Xp || 0)
        .setRequiredXP(client.calculateLevelXp(fetchedLevel?.Level || 1))
        .setStatus(targetUser.presence?.status || 'offline')
        .setProgressBar('#FFC300', 'COLOR')
        .setUsername(targetUser.user.username)
        .setDiscriminator(targetUser.user.discriminator);

      const data = await rank.build();
      const attachment = new AttachmentBuilder(data);

      return await interaction.followUp({
        embeds: [
          {
            color: Colors.Aqua,
            footer: footer(),
            image: {
              url: 'attachment://file.jpg',
            },
          },
        ],
        files: [attachment],
      });
    },
    message: async ({ client, message }) => {
      if (!message.guild) return;

      const targetUserId =
        message.mentions.members?.first() || message.author.id;
      const targetUser = await message.guild.members.fetch(targetUserId);

      const fetchedLevel = await Level.findOne({
        UserID: targetUserId,
        GuildID: message.guild.id,
      });

      const rank = new canvacord.Rank()
        .setAvatar(targetUser.user.displayAvatarURL({ size: 256 }))
        .setLevel(fetchedLevel?.Level || 1)
        .setCurrentXP(fetchedLevel?.Xp || 0)
        .setRequiredXP(client.calculateLevelXp(fetchedLevel?.Level || 1))
        .setStatus(targetUser.presence?.status || 'offline')
        .setProgressBar('#FFC300', 'COLOR')
        .setUsername(targetUser.user.username)
        .setDiscriminator(targetUser.user.discriminator);

      const data = await rank.build();
      const attachment = new AttachmentBuilder(data);

      return await message.reply({
        embeds: [
          {
            color: Colors.Aqua,
            footer: footer(),
            image: {
              url: 'attachment://file.jpg',
            },
          },
        ],
        files: [attachment],
        allowedMentions: {
          parse: [],
        },
      });
    },
  },
});
