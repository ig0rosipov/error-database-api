const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },
});

module.exports = mongoose.model('machine', machineSchema);
