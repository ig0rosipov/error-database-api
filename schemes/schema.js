module.exports.mainSchema = `
type Machine {
  _id: ID!
  name: String!
}

type Fault {
  _id: ID!
  name: String!
  description: String!
  solution: String!
  images: [String]!
  machine: Machine!
}

type Query {
  faults: [Fault!]!
  articles: [Article!]!
  machines: [Machine!]!
}

type Article {
  _id: ID!
  name: String!
  articleNumber: String!
  machine: Machine
}

type ErrorMessage {
  message: String!
  statusCode: Int!
}

union FaultResponse = Fault | ErrorMessage
union ArticleResponse = Article | ErrorMessage

type Mutation {
  addNewFault(
    name: String
    description: String
    solution: String
    images: [String]
    machineName: String ): FaultResponse!
  addNewMachine(name: String): Machine
  addNewArticle(
    name: String
    articleNumber: String
    machineName: String
  ): ArticleResponse!
}
`;
