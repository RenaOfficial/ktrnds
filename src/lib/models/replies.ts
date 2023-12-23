import mongoose from 'mongoose';

const replies = mongoose.model(
  'replies',
  new mongoose.Schema({
    GuildID: String,
    Replies: [
      {
        Trigger: String,
        Reply: String,
      },
    ],
  })
);

export { replies };
