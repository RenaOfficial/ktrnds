import { Event } from '../../lib/classes/Event';

export default new Event('messageCreate', async (message) => {
  if (message.guild?.id !== '1149350818747781120' || !message.channel) return;

  if (
    message.channel.id === '1149350818747781122' &&
    message.author.id === '282859044593598464'
  ) {
    if (message.content.match('サーバー参加ありがとうございます')) {
      await message.react('☘️');
    }
  }

  if (message.channel.id === '1191332949665255494') {
    if (message.author.bot) return;
    await message.react('☘️');
  }
});
