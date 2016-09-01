const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  name: {
    first: String,
    last: String,
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
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },

  token: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', (next) => {
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
