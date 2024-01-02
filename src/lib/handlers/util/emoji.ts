import { type Message } from 'discord.js';
import { client } from '@/index';

const EMOJI_REGEX = /<:(.+):(\d+)>/m;
const ANIMATED_EMOJI_REGEXP = /<a:(.+):(\d+)>/m;

type EmojiResult = Readonly<{
  name: string,
  proxyUrl: string
}>;

const matchEmoji = (content: string): EmojiResult | undefined => {
  const emojiMatch = content.match(EMOJI_REGEX);

  if (emojiMatch) {
    return {
      name: emojiMatch[1],
      proxyUrl: `https://cdn.discordapp.com/emojis/${emojiMatch[2]}.png?size=4096`
    };
  }

  const animatedEmojiMatch = content.match(ANIMATED_EMOJI_REGEXP);

  if (!animatedEmojiMatch) {
    return;
  }

  return {
    name: animatedEmojiMatch[1],
    proxyUrl: `https://cdn.discordapp.com/emojis/${animatedEmojiMatch[2]}.gif?size=4096`
  };
};

const resolveEmoji = (message: Message<true>): EmojiResult | undefined => {
  const firstAttachmentProxyUrl = message.attachments.first()?.proxyURL;
  const args: readonly string[] = message.content.split(/\s+/);

  if (firstAttachmentProxyUrl) {
    return {
      name: args[0] || client.randomName(),
      proxyUrl: firstAttachmentProxyUrl
    };
  }

  const emojiMatchResult = matchEmoji(message.content);

  if (emojiMatchResult) {
    return emojiMatchResult;
  }

  const [arg0, arg1] = args;

  if (!arg0 && !arg1) {
    return;
  }

  if (!arg1) {
    if (!/^https?:\/\//.test(arg0)) {
      return;
    }

    return {
      name: client.randomName(),
      proxyUrl: arg0
    };
  }

  if (!/^https?:\/\//.test(arg1)) {
    return;
  }

  return {
    name: arg0,
    proxyUrl: arg1
  };
};

export {
  EMOJI_REGEX,
  ANIMATED_EMOJI_REGEXP,
  type EmojiResult,
  matchEmoji,
  resolveEmoji
};
