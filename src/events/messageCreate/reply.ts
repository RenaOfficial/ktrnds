import { Event } from '@/lib/classes/Event';
import { replies } from '@/lib/models/replies';

export default new Event('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const reply_data = await replies.findOne({ GuildID: message.guild.id });

  if (!reply_data) return;

  const action = reply_data.Replies.find(
    (data) => data.Trigger === message.content
  );

  if (!action || !action.Reply) return;

  return await message.reply({
    content: action.Reply,
    allowedMentions: {
      parse: [],
    },
  });
});
