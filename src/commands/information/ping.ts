import { ApplicationCommandType, Colors } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import { footer, pingEmbed } from '@/lib/handlers/component/Embed';

export default new Command({
  name: 'ping',
  description: 'Botの応答速度を表示します',
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  slash: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;

    // 応答速度を計算
    const response =
      Date.now() - (await interaction.fetchReply()).createdTimestamp;

    await interaction.followUp(await pingEmbed(response));
  },
  chat: async ({ message }) => {
    // 応答速度を計算
    const response = Date.now() - message.createdTimestamp;

    await message.reply(await pingEmbed(response));
  },
});
