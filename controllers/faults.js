const base64Img = require('base64-img');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Fault = require('../models/fault');
const Machine = require('../models/machine');
const BadRequestError = require('../errors/bad-request');

const convertToImg = (file, filePath, name) => new Promise((resolve, reject) => {
  base64Img.img(file, filePath, name, (err, filepath) => {
    const relativePathArray = filepath.split('\\').slice(-4);
    relativePathArray.unshift('.');
    resolve(relativePathArray.join('/'));
    reject(err);
  });
});

const convertToBase64 = (filePath) => new Promise((resolve, reject) => {
  base64Img.base64(filePath, (err, data) => {
    resolve(data);
    reject(err);
  });
});

const assetsPath = path.join(path.dirname(__dirname), '/assets');
const imagesPath = path.join(assetsPath, '/images');

module.exports.getAllFaults = () => {
  const faults = Fault.find({}).lean(); // Получаем список неисправностей.
  const directories = faults
    .then((faultList) => faultList.map(
      (fault) => Promise.all(fault.images.map(
        (absolutePath) => convertToBase64(
          path.join(path.dirname(__dirname), absolutePath),
        ),
      )),
    ))
    .then((data) => Promise.all(data)).then((data) => data);
  // Из списка неисправностей в каждом объекте из поля images получаем абсолютные пути изображений
  // после чего сразу же конвертируем их в dataURL и возвращаем Promise с массивами изображений.

  return Promise.all([faults, directories]).then((data) => {
    const [faultList, images] = data;
    return faultList.map((fault, index) => ({
      ...fault,
      images: images[index],
    }));
  });
};

module.exports.addFault = ({
  name, description, solution, images, machineName,
}) => Machine.findOne({ name: machineName })
  .then((machineData) => {
    if (!machineData) {
      throw new BadRequestError('Нет такого оборудования');
    }
    // создается новая запись об ошибке.
    return Fault.create({
      name,
      description,
      solution,
      machine: {
        _id: machineData._id,
        name: machineData.name,
      },
    });
  })
  .then((addedFault) => {
    // проверяется есть ли нужные директории. Если нет, то создаются. Возвращает Добавленную ошибку.
    if (fs.existsSync(assetsPath)) {
      if (fs.existsSync(imagesPath)) {
        return addedFault;
      }
      return fsPromises.mkdir(imagesPath)
        .then(() => addedFault)
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
      .then(() => addedFault)
      .catch((err) => ({
        path: imagesPath,
        isCreated: false,
        err,
      }));
  })
  .then((addedFault) => {
    // когда папки созданы - dataURL конвертируется в изображение и помещается в нужную папку.
    // Возвращает пути и запись об ошибке которая прокидывается через then'ы.
    const directories = images.map((image, index) => convertToImg(image, `${imagesPath}/${addedFault._id}`, `${addedFault._id}_${index}`));
    return Promise.all(directories).then((dirs) => ({
      dirs,
      addedFault,
    }));
  })
  .then((data) => Fault.findByIdAndUpdate(
    // Запись об ошибке редактируется, добавляя относительные пути к изображениям в поле images.
    data.addedFault._id,
    { images: data.dirs },
    { new: true },
  ).lean())
  .then((updatedFault) => ({
    // Добавляется __typename в финальный объект. GraphQL требует.
    __typename: 'Fault',
    ...updatedFault,
  }))
  .catch((err) => ({
    __typename: 'ErrorMessage',
    message: err.message,
    statusCode: err.statusCode,
  }));
