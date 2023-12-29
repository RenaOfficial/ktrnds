import { Event } from '@/lib/classes/Event';
import Level from '@/lib/models/level';
import { client } from '@/index';
import { Colors } from 'discord.js';

const cooldowns = new Set();

function getRandomXp(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default new Event('messageCreate', async (message) => {
  if (!message.guild || message.author.bot || cooldowns.has(message.author.id))
    return;

  const xpToGive = getRandomXp(5, 15);

  const level = await Level.findOne({
    UserID: message.author.id,
    GuildID: message.guild.id,
  });

  if (level) {
    level.Xp += xpToGive;

    if (level.Xp > client.calculateLevelXp(level.Level)) {
      level.Xp = 0;
      level.Level += 1;

      message.channel.send({
        embeds: [
          {
            title: 'レベルアップ',
            description: `${message.member}のレベルが**${level.Level}**になりました`,
            color: Colors.Gold,
          },
        ],
      });
    }

    await level.save().catch((e) => {
      console.log(`Error saving updated level ${e}`);
      return;
    });

    cooldowns.add(message.author.id);

    setTimeout(() => {
      cooldowns.delete(message.author.id);
    }, 60000);
  } else {
    const newLevel = new Level({
      UserID: message.author.id,
      GuildID: message.guild.id,
      Xp: xpToGive,
    });

    await newLevel.save();
    cooldowns.add(message.author.id);
    setTimeout(() => {
      cooldowns.delete(message.author.id);
    }, 60000);
  }
});
