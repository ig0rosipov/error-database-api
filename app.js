require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const errorHandler = require('./middlewares/errorHandler');
const { getAllFaults, addFault } = require('./controllers/faults');
const { addMachine } = require('./controllers/machines');
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
  faults: () => getAllFaults().then((data) => data),
  addNewFault: ({
    name, description, solution, images, machineName,
  }) => addFault({
    name, description, solution, images, machineName,
  }),
  addNewMachine: ({ name }) => addMachine({ name }),
};
const app = express();

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
