const { ApolloServer, gql } = require('apollo-server-micro')
const Photon = require('@generated/photon')

const typeDefs = gql`
  type Query {
    hello: String
    users: [User]
  }

  type User {
    id: ID!
    name: String
    email: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'world',
    users: async (root, args, { photon }) => {
      const users = await photon.users.findMany()

      return users
    },
  },
}

const photon = new Photon.default()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: req => ({
    ...req,
    photon,
  }),
})

module.exports = server.createHandler()
