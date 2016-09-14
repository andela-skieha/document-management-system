const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
},

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
