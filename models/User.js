const mongoose = require('mongoose');
//var passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // resetPasswordToken: {
  //   type: String,
  // },
  // resetPasswordExpires: { type: Date },
});
//user can use passport mongoose methods
//UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', UserSchema);
