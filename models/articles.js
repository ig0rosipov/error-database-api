const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  articleNumber: {
    type: String,
    required: true,
    minlength: 2,
  },
  machine: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: true,
    },
    name: String,
  }
})

module.exports = mongoose.model('article', articleSchema);