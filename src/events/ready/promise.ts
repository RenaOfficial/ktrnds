import { Event } from '@/lib/classes/Event';
import moment from 'moment';
import { client } from '@/index';
import { ChannelType } from 'discord.js';

export default new Event('ready', () => {
  setInterval(async () => {
    const now = moment();
    const message = client.promises.get(now.toDate());

    if (message) {
      const channel = client.channels.cache.get(message.channel);

      if (
        !channel ||
        !(
          channel.type === ChannelType.GuildAnnouncement ||
          channel.type === ChannelType.GuildText
        )
      )
        return;

      channel.send({
        content: message.message,
        allowedMentions: {
          parse: [],
        },
      });
    }
  }, 500);
});
