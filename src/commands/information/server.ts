import { Command } from '../../lib/classes/Command';
import { serverInfo } from '../../lib/handlers/component/Embed';

export default new Command({
  name: 'server',
  description: 'サーバー情報を表示します',
  execute: {
    interaction: async ({ interaction }) => {
      const guild = interaction.guild;
      if (!guild) return;

      const embed = await serverInfo(guild);

      await interaction.followUp({
        embeds: [embed],
      });
    },
    message: async ({ message }) => {
      const guild = message.guild;
      if (!guild) return;

      const embed = await serverInfo(guild);

      await message.reply({
        embeds: [embed],
        allowedMentions: {
          parse: [],
        },
      });
    },
  },
});
