const Machine = require('../models/machine');

module.exports.addMachine = ({ name }) => Machine.create({
  name,
}).then((machine) => machine).catch((err) => err);
