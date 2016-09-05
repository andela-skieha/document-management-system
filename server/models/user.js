/* eslint-disable func-names */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    firstname: String,
    lastname: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  role: {
    type: String,
    default: 'user',
  },
},

  {
    timestamps: true,
  }
);

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    next();
  }

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    return next();
  });
});

UserSchema.methods.comparePassword = (password) => {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
