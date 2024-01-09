import { model, Schema } from 'mongoose';
import { randomUUID } from 'crypto';

export default model(
  'captcha',
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    RoleID: {
      type: String,
      required: true,
    },
    MessageID: {
      type: String,
      required: true,
    },
    CaptchaID: {
      type: typeof randomUUID(),
      required: true,
    },
  })
);
