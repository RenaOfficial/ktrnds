require('dotenv').config();
import { ExtendedClient } from './lib/classes/ExtendedClient';
export const client = new ExtendedClient();

console.clear();
client.start();
