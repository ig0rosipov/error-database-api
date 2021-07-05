const Fault = require('../models/fault');
const Machine = require('../models/machine');
const BadRequestError = require('../errors/bad-request');

module.exports.getAllFaults = () => Fault.find({})
  .then((faultList) => faultList)
  .catch((err) => err);

module.exports.addFault = ({
  name, description, solution, images, machineName,
}) => Machine.findOne({ name: machineName })
  .then((machineData) => {
    if (!machineData) {
      throw new BadRequestError('Нет такого оборудования');
    }
    return Fault.create({
      name,
      description,
      solution,
      images,
      machine: {
        _id: machineData._id,
        name: machineData.name,
      },
    });
  })
  .then((fault) => ({
    __typename: 'Fault',
    ...fault,

  }))
  .then((result) => ({
    __typename: result.__typename,
    ...result._doc,
  }))
  .catch((err) => ({
    __typename: 'ErrorMessage',
    message: err.message,
    statusCode: err.statusCode,
  }));
