import { model, Schema } from 'mongoose';
import { randomUUID } from 'crypto';

export default model(
  'captcha_sessions',
  new Schema({
    SessionID: {
      type: String,
      required: true,
    },
    UserID: {
      type: String,
      required: true,
    },
    CaptchaID: {
      type: typeof randomUUID(),
      required: true,
    },
  })
);
