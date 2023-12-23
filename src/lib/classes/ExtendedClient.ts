import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
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

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public snipes: Collection<string, Message<boolean> | PartialMessage> =
    new Collection();
  public edit_snipes: Collection<
    string,
    {
      oldMessage: Message<boolean> | PartialMessage;
      newMessage: Message<boolean> | PartialMessage;
    }
  > = new Collection();

  public constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
      ],
    });
  }

  public start(): void {
    this.registerModules().then(() => {
      console.log(`\x1b[36mModules loaded successfully\x1b[0m`);
    });
    this.login(process.env.CLIENT_TOKEN).then(() => {
      console.log(`\x1b[32mLogged in successfully\x1b[0m`);
    });
    mongoose.connect(process.env.DATABASE_CONNECTION_URI).then(() => {
      console.log(`\x1b[36mSuccessfully connected to database\x1b[0m`);
    })
  }

  private async importFile(
    filePath: string
  ): Promise<CommandType | Event<keyof ClientEvents> | undefined> {
    return (await import(filePath))?.default;
  }

  private async registerModules(): Promise<void> {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      __dirname + `/../../commands/*/*{.ts,.js}`
    );
    for (const filePath of commandFiles) {
      const command = await this.importFile(filePath);
      if (!command || !('name' in command)) continue;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    this.on('ready', () => {
      this.application?.commands
        .set(slashCommands)
        .then(() => {
          console.log(
            `\x1b[32mRegistered ${slashCommands.length} slash commands on ${this.guilds.cache.size} servers\x1b[0m`
          );
        })
        .catch((e: Error) => {
          console.log(`\x1b[31mFailed to register slash commands\x1b[0m`);
          console.log(`\x1b[31m=> ${e}\x1b[0m`);
        });
    });

    const eventFiles = await globPromise(
      `${__dirname}/../../events/*{.ts,.js}`
    );
    for (const filePath of eventFiles) {
      const event = await this.importFile(filePath);
      if (event && 'event' in event) {
        this.on(event.event, event.run);
      }
    }
  }
}
