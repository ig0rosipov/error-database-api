require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const errorHandler = require('./middlewares/errorHandler');
const { getAllFaults, addFault } = require('./controllers/faults');
const { getAllMachines, addMachine } = require('./controllers/machines');
const { getAllArticles, addArticle } = require('./controllers/articles');
const { mainSchema } = require('./schemes/schema');

const { PORT } = process.env;

mongoose.connect('mongodb://localhost:27017/error-database',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

const schema = buildSchema(mainSchema);

const root = {
  faults: () => getAllFaults(),
  machines: () => getAllMachines(),
  articles: () => getAllArticles(),
  addNewFault: ({
    name, description, solution, images, machineName,
  }) => addFault({
    name, description, solution, images, machineName,
  }),
  addNewMachine: ({ name }) => addMachine({ name }),
  addNewArticle: ({
    name, articleNumber, machineName,
  }) => addArticle({ name, articleNumber, machineName }),
};
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.use(express.json());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
