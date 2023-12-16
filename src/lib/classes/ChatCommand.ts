import { ChatCommandType } from '@/lib/interfaces/ChatCommand';

export class ChatCommand {
  constructor(commandOptions: ChatCommandType) {
    Object.assign(this, commandOptions);
  }
}
