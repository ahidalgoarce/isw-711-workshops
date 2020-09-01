const { buildSchema } = require('graphql');
exports.graphQLschema = buildSchema(  
  `type Query {
    orders: [Order]
    clients: [Client]
    getOrder(orderId: Int!): Order
    hello: String
  }

  type Mutation {
    addClient(name: String!, lastName: String! ): Client
    addOrder(client: Client!, products: [Product!]): Order
  }

  type Order {
    client: Client!
    products: [Product!]
  }

  type Client {
    id: ID!
    name: String!
    lastName: String!
    email: String
    website: String
  }

  type Product {
    id: ID!
    quantity: Int!
    name: String!
    price: Float!
  }`);