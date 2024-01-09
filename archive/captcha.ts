import { Event } from '../src/lib/classes/Event';
import Schema from './webCaptcha';
import { randomUUID } from 'crypto';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { client } from '../src';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'web_verify') {
    const data = await Schema.findOne({ MessageID: interaction.message.id });

    if (!data) {
      return await interaction.reply({
        content: '認証コードの発行に失敗しました',
        ephemeral: true,
      });
    }

    if (data) {
      const id = randomUUID();
      const url = 'http://localhost:3003/login/?id=' + id;

      await interaction.reply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setURL(url)
              .setLabel('認証')
              .setStyle(ButtonStyle.Link)
          ),
        ],
        ephemeral: true,
      });

      client.webCaptcha.set(id, {
        GuildID: interaction.guild?.id as string,
        UserID: interaction.user.id,
      });
    }
  }
});
