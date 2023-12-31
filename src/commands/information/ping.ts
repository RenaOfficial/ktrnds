import { ApplicationCommandType, Colors } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import { footer } from '@/lib/handlers/component/Embed';
import { sendReply } from '@/lib/handlers/commands/ping';

const pingingEmbed = {
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
};

export default new Command({
  name: 'ping',
  description: 'Botの応答速度を表示します',
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  slash: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.followUp(pingingEmbed);

    const responseData = await sendReply({ data: interaction });

    await interaction.editReply(responseData);
  },
  chat: async ({ message }) => {
    const msg = await message.reply(pingingEmbed);

    const responseData = await sendReply({ data: message });

    await msg.edit(responseData);
  },
});
