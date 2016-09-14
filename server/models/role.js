const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
},

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Role', RoleSchema);
