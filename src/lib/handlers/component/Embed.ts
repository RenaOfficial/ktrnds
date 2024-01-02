import { APIEmbedFooter, Colors } from 'discord.js';
import { client } from '@/index';
import {
  AE_BATTERY_FULL, AE_BATTERY_GOOD, AE_BATTERY_LOW,
  E_JOURNEY,
  E_ONLINE,
  E_SPACE,
  E_STATS_BAD,
  E_STATS_EXCELLENT,
  E_STATS_GOOD, E_STATUS_ONLINE,
} from '@/lib/util/emojis';
import osu from 'node-os-utils';

const footer = (): APIEmbedFooter => {
  return {
    text: client.user?.tag as string,
    icon_url: client.user?.avatarURL() as string,
  };
};

const pingEmbed = async (response: number) => {
  // WSの速度を計算
  const ping = client.ws.ping;

  // CPU使用率を計算
  const cpuUsage = await osu.cpu.usage();
  // RAM使用率を計算
  const memUsage = (await osu.mem.info()).usedMemPercentage;

  // 整数にする
  const cpuInteger = Math.round(cpuUsage);
  const memInteger = Math.round(memUsage);

  // CPUの使用率に応じて絵文字を変更
  const cpuEmoji =
    cpuInteger >= 80
      ? AE_BATTERY_LOW
      : cpuInteger < 80 && cpuInteger >= 50
        ? AE_BATTERY_GOOD
        : AE_BATTERY_FULL;

  // RAMの使用率に応じて絵文字を変更
  const memEmoji =
    memInteger >= 80
      ? AE_BATTERY_LOW
      : memInteger < 80 && memInteger >= 50
        ? AE_BATTERY_GOOD
        : AE_BATTERY_FULL;

  // レスポンス速度に応じて絵文字を変更
  const responseEmoji =
    response >= 400
      ? E_STATS_EXCELLENT
      : response < 400 && response >= 600
        ? E_STATS_GOOD
        : E_STATS_BAD;

  // WS速度に応じて絵文字を変更
  const latencyEmoji =
    ping >= 200
      ? E_STATS_EXCELLENT
      : ping < 200 && ping >= 400
        ? E_STATS_GOOD
        : E_STATS_BAD;

  // フィールドを作成
  const latencyMessage =
    E_SPACE + latencyEmoji + '**WebSocket:** `' + ping + '`ms';
  const responseMessage =
    E_SPACE + responseEmoji + '**Response:** `' + response + '`ms';

  const cpuMessage = cpuEmoji + ' **CPU:** `' + cpuUsage + '`%';
  const memMessage = memEmoji + ' **RAM:** `' + memUsage + '`%';

  const resourceFieldMessage = E_SPACE + E_JOURNEY + ' **Resources:**';

  const resourceField =
    E_SPACE + E_SPACE + cpuMessage + '\n' + E_SPACE + E_SPACE + memMessage;

  const title = E_ONLINE + ' **Shard[0]:**';

  return {
    embeds: [
      {
        title: E_STATUS_ONLINE + ' Bot Status:',
        fields: [
          {
            name: title,
            value:
              latencyMessage +
              '\n' +
              responseMessage +
              '\n' +
              resourceFieldMessage +
              '\n' +
              resourceField,
          },
        ],
        color: Colors.Aqua,
        footer: footer(),
      },
    ],
    allowedMentions: {
      parse: [],
    },
  }
}

export { footer, pingEmbed };
