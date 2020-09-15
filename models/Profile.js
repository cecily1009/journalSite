const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  bio: {
    type: String,
  },
  status: {
    type: String,
    default: 'This guy is lazy, nothing here...',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  allPrivate: {
    type: String,
    default: 'false',
  },
  journals: [
    {
      journal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'journal',
      },
    },
  ],
});

module.exports = mongoose.model('Profile', ProfileSchema);
