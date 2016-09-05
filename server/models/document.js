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
},

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
