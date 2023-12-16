import { APIEmbedFooter, Colors } from 'discord.js';
import { client } from '../../index';

const footer = (): APIEmbedFooter => {
  return {
    text: client.user?.tag as string,
    icon_url: client.user?.avatarURL() as string,
  };
};

export { footer };
