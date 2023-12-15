require('dotenv').config();
import { ExtendedClient } from './lib/classes/ExtendedClient';
export const client = new ExtendedClient();

export function start() {
  console.clear();
  client.start();
}
