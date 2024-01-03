import {
  APIInteractionGuildMember,
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GuildMember,
  IntentsBitField,
  Message,
  PartialMessage,
} from 'discord.js';
import { CommandType } from '@/lib/interfaces/Command';
import { Event } from '@/lib/classes/Event';
import { promisify } from 'util';
import glob from 'glob';
import mongoose from 'mongoose';
import * as process from 'process';
import moment from 'moment';

const globPromise = promisify(glob);

type LogType = 'INFO' | 'DEBUG' | 'ERROR' | 'CLIENT';

export const log = (message: string | Error, LogType: LogType) => {
  message = message.toString();
  const now = moment().format('MM/DD hh:mm:ss');
  const type =
    LogType === 'INFO'
      ? '\x1b[46mINFO\x1b[0m'
      : LogType === 'DEBUG'
        ? '\x1b[45mDEBUG\x1b[0m'
        : LogType === 'ERROR'
          ? '\x1b[41mERROR\x1b[0m'
          : LogType === 'CLIENT'
            ? '\x1b[43mCLIENT\x1b[0m'
            : '';
  console.log(
    `\x1b[33m[\x1b[0m${now}\x1b[33m]\x1b[0m ${type} ${
      LogType === 'ERROR' ? '\x1b[31m' : '\x1b[32m'
    }${message.toString()}\x1b[0m`
  );
};

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection<
    string,
    CommandType
  >();
  public snipes: Collection<string, Message<boolean> | PartialMessage> =
    new Collection<string, Message<boolean> | PartialMessage>();
  public edit_snipes: Collection<
    string,
    {
      oldMessage: Message<boolean> | PartialMessage;
      newMessage: Message<boolean> | PartialMessage;
    }
  > = new Collection<
    string,
    {
      oldMessage: Message<boolean> | PartialMessage;
      newMessage: Message<boolean> | PartialMessage;
    }
  >();

  public calculateLevelXp(level: number): number {
    return 100 * level || 1;
  }

  public constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
      ],
    });
  }

  public start(): void {
    const startTime = process.hrtime();
    this.registerModules().then(() => {
      const endTime = process.hrtime(startTime);
      const processingTimeMs = Math.floor(endTime[0] * 1000 + endTime[1] / 1e6);
      log(
        `Modules loaded successfully on \x1b[35m${processingTimeMs}ms\x1b[0m`,
        'INFO'
      );
    });
    this.login(process.env.CLIENT_TOKEN).then(() => {
      const endTime = process.hrtime(startTime);
      const processingTimeMs = Math.floor(endTime[0] * 1000 + endTime[1] / 1e6);
      log(
        `Logged in successfully on \x1b[35m${processingTimeMs}ms\x1b[0m`,
        'INFO'
      );
    });
    mongoose.connect(process.env.DATABASE_CONNECTION_URI).then(() => {
      const endTime = process.hrtime(startTime);
      const processingTimeMs = Math.floor(endTime[0] * 1000 + endTime[1] / 1e6);
      log(
        `Successfully connected to database on \x1b[35m${processingTimeMs}ms\x1b[0m`,
        'INFO'
      );
    });
  }

  public async importFile<T>(filePath: string): Promise<T> {
    return (await import(filePath))?.default;
  }

  public async loadEvents() {
    const eventFiles = await globPromise(
      `${__dirname}/../../events/**/*{.ts,.js}`
    );
    for (const filePath of eventFiles) {
      const event = await this.importFile<Event<keyof ClientEvents>>(filePath);
      if (event && 'event' in event) {
        this.on(event.event, event.run);
      }
    }
  }

  private async registerModules(): Promise<void> {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      __dirname + `/../../commands/*/*{.ts,.js}`
    );

    for (const filePath of commandFiles) {
      const command = await this.importFile<CommandType>(filePath);
      if (!command || !('name' in command)) continue;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    this.on('ready', () => {
      const startTime = process.hrtime();
      this.application?.commands
        .set(slashCommands)
        .then(() => {
          const endTime = process.hrtime(startTime);
          const processingTimeMs = Math.floor(
            endTime[0] * 1000 + endTime[1] / 1e6
          );
          log(
            `Registered ${slashCommands.length} slash commands on ${this.guilds.cache.size} servers on \x1b[35m${processingTimeMs}ms\x1b[0m`,
            'INFO'
          );
        })
        .catch((e: Error) => {
          log(`Failed to register slash commands\x1b[0m`, 'ERROR');
          console.log(`\x1b[31m=> ${e}\x1b[0m`);
        });
    });

    await this.loadEvents();
  }
}
