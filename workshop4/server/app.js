import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {prepare} from "../util/index"


const app = express()

app.use(cors())

const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 3000
const MONGO_URL = 'mongodb://localhost:27017/cms'



export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)

    const Clients = db.collection('clients')
    const Orders = db.collection('orders')
    const Products = db.collection('products')

    const typeDefs = [
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
    }`
  ];

    const resolvers = {
      Query: {
        client: async (root, {_id}) => {
          return prepare(await  Clients.findOne(ObjectId(_id)))
        },
        clients: async () => {
          return (await Clients.find({}).toArray()).map(prepare)
        },
        order: async (root, {_id}) => {
          return prepare(await Orders.findOne(ObjectId(_id)))
        },
        product: async (root, {_id}) => {
          return prepare(await Products.findOne(ObjectId(_id)))
        },
      },
      Client: {
        orders: async ({_id}) => {
          return (await Clients.find({postId: _id}).toArray()).map(prepare)
        }
      },
      Product: {
        products: async ({productId}) => {
          return prepare(await Products.findOne(ObjectId(postId)))
        }
      },
      Mutation: {
        addClient: async (root, args, context, info) => {
          const res = await Clients.insertOne(args)
          return prepare(res.ops[0])
        },
        addOrder: async (root, args) => {
          const res = await Orders.insert(args)
          return prepare(await Orders.findOne({_id: res.insertedIds[1]}))
        },
      },
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })


    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))


    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  }

}
