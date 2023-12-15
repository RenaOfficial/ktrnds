import { ChatCommandType } from '../interfaces/ChatCommand';

export class ChatCommand {
  constructor(commandOptions: ChatCommandType) {
    Object.assign(this, commandOptions);
  }
}
