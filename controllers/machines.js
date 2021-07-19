const Machine = require('../models/machine');

module.exports.getAllMachines = () => Machine.find({})
  .then((machine) => machine)
  .catch((err) => err);

module.exports.addMachine = ({ name }) => Machine.create({
  name,
})
  .then((machine) => machine)
  .catch((err) => err);
