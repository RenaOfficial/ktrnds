import { CommandType } from '@/lib/interfaces/Command';

export class Command {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions);
  }
}
