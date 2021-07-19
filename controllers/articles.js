const Article = require('../models/articles');
const Machine = require('../models/machine');
const BadRequestError = require('../errors/bad-request');

module.exports.getAllArticles = () => Article.find({})
  .then((articles) => articles)
  .catch((err) => err);

module.exports.addArticle = ({
  name,
  articleNumber,
  machineName,
}) => Machine.findOne({ name: machineName })
  .then((machineData) => {
    if (!machineData) {
      throw new BadRequestError('Нет такого оборудования');
    }
    return Article.create({
      name,
      articleNumber,
      machine: {
        _id: machineData._id,
        name: machineData.name,
      },
    });
  })
  .then((article) => ({
    __typename: 'Article',
    ...article,
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
