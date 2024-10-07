const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const cors = require('cors');

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

 
  app.use(cors());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false
  });

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

  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  try {
    await new Promise(resolve => db.once('open', resolve));
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
      console.log(`🚀 Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
}

startApolloServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});