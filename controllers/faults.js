const Fault = require('../models/fault');
const Machine = require('../models/machine');
const BadRequestError = require('../errors/bad-request');

module.exports.getAllFaults = () => Fault.find({})
  .then((faultList) => faultList)
  .catch((err) => err);
module.exports.addFault = ({
  name, description, solution, images, machineName,
}) => {
  // console.log(item);
  Machine.findOne({
    name: machineName,
  })
    .then((machineData) => {
      console.log(machineData);
      if (machineData === null) {
        throw new BadRequestError('Нет такого оборудования');
      }
      return Fault.create({
        name,
        description,
        solution,
        images,
        machine: machineData,
      }).lean();
    })
    .then((fault) => {
      console.log(fault);
      return fault;
    })
    .catch((err) => err);
};
