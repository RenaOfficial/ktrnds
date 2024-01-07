import { Schema, model } from 'mongoose';

export default model(
  'Users',
  new Schema({
    UserID: {
      type: String,
      required: true,
    },
    IP: {
      type: String,
      required: true,
    },
    GuildID: {
      type: String,
      required: true,
    },
  })
);
