const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.send('API server running. Use GraphQL at /graphql');
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
      console.log(`🚀 Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });

  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  return { server, app };
}

startApolloServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});