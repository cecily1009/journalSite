const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      'https://kangsblackbeltacademy.com/wp-content/uploads/2017/04/default-image.jpg',
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
