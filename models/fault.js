const mongoose = require('mongoose');
const Machine = require('./machine');

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
  machine: {
    type: Machine,
  },
});

module.exports = mongoose.model('fault', faultSchema);
