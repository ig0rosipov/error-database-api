const mongoose = require('mongoose');

const faultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  solution: {
    type: String,
    required: true,
    minlength: 2,
  },
  images: {
    type: [String],
    default: [],
  },
  machine:
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: true,
    },
    name: String,
  }
  ,
});

module.exports = mongoose.model('fault', faultSchema);
