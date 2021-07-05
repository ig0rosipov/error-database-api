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
}

input FaultInput {
  name: String
  description: String
  solution: String
  images: [String]
  machineName: String
}

type ErrorMessage {
  message: String!
  statusCode: Int!
}

union FaultResponse = Fault | ErrorMessage

type Mutation {
  addNewFault(
    name: String
    description: String
    solution: String
    images: [String]
    machineName: String ): FaultResponse!
  addNewMachine(name: String): Machine
}
`;
