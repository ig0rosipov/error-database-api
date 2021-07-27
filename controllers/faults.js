const CyrillicToTranslit = require('cyrillic-to-translit-js');
const base64Img = require('base64-img');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Fault = require('../models/fault');
const Machine = require('../models/machine');
const BadRequestError = require('../errors/bad-request');

const cyrillicToTranslit = new CyrillicToTranslit();

const convertToImg = (file, filePath, name) => new Promise((resolve, reject) => {
  base64Img.img(file, filePath, name, (err, filepath) => {
    const relativePathArray = filepath.split('\\').slice(-3);
    relativePathArray.unshift('.');
    resolve(relativePathArray.join('/'));
    reject(err);
  });
});

const assetsPath = path.join(path.dirname(__dirname), '/assets');
const imagesPath = path.join(assetsPath, '/images');

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
    if (fs.existsSync(assetsPath)) {
      if (fs.existsSync(imagesPath)) {
        return machineData;
      }
      return fsPromises.mkdir(imagesPath)
        .then(() => machineData)
        .catch((err) => ({
          path: imagesPath,
          isCreated: false,
          err,
        }));
    }
    return fsPromises.mkdir(assetsPath)
      .catch(() => {
        throw new Error({
          path: assetsPath,
          isCreated: false,
        });
      })
      .then(() => fsPromises.mkdir(imagesPath))
      .then(() => machineData)
      .catch((err) => ({
        path: imagesPath,
        isCreated: false,
        err,
      }));
  }).then((machineData) => {
    const directories = images.map((image, index) => convertToImg(image, `${imagesPath}/${cyrillicToTranslit.transform(name, '_')}`, `${cyrillicToTranslit.transform(name, '_')}_${index}`));
    return Promise.all(directories).then((dirs) => ({
      dirs,
      machineData,
    }));
  })
  .then((data) => Fault.create({
    name,
    description,
    solution,
    images: data.dirs,
    machine: {
      _id: data.machineData._id,
      name: data.machineData.name,
    },
  })
    .then((fault) => ({
      __typename: 'Fault',
      ...fault,
    }))
    .then((result) => ({
      __typename: result.__typename,
      ...result._doc,
    }))
    .catch((err) => {
      console.log(err);
      return ({
        __typename: 'ErrorMessage',
        message: err.message,
        statusCode: err.statusCode,
      });
    }));
