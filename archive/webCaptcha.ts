import { Schema, model } from 'mongoose';

export default model(
  'Web_captcha',
  new Schema({
    MessageID: {
      type: String,
      required: true,
    },
    RoleID: {
      type: String,
      required: true,
    },
    GuildID: {
      type: String,
      required: true,
    },
  })
);
