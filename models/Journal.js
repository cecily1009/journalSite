const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  //   image: {
  //     id: String,
  //     url: String,
  //   },
  image: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  created: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  setPrivate: {
    type: String,
    default: 'true',
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
});

module.exports = mongoose.model('journal', JournalSchema);
