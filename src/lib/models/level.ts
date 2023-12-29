import { Schema, model } from 'mongoose';

export default model(
  'Level',
  new Schema({
    UserID: {
      type: String,
      required: true,
    },
    GuildID: {
      type: String,
      required: true,
    },
    Xp: {
      type: Number,
      default: 0,
    },
    Level: {
      type: Number,
      default: 1,
    },
  })
);
