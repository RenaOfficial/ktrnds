require('dotenv').config();
import { ExtendedClient } from './lib/classes/ExtendedClient';

export const client = new ExtendedClient();

console.clear();
client.start();

process.on("uncaughtException", async (error: Error) => {
  return error
})

process.on('unhandledRejection', async (error: Error) => {
  return error;
});