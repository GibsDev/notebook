const fs = require('fs');
const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const { ApolloServer } = require('apollo-server-express');
const email = require('./email');

const env = process.env.NODE_ENV || 'development';
const DEV = (env === 'development');

// Error catching
process.on('uncaughtException', async (err) => {
    console.error(err.stack);
    await email({
        subject: 'Notebook: An uncaught exception occurred',
        text: err.stack,
        html: `<pre>${err.stack}</pre>`
    });
    process.exit(1);
});

process.on('unhandledRejection', async (event) => {
    let message = event;
    if (event.stack) {
        message = event.stack;
    }
    console.error(event);
    await email({
        subject: 'Notebook: An unhandled rejection occurred',
        text: message,
        html: `<pre>${message}</pre>`
    });
    process.exit(1);
});

// Setup graphql
const schemaPath = path.resolve(__dirname, './schema.graphql');
const distPath = path.resolve(__dirname, '../client/', DEV ? 'dist-dev' : 'dist');
const resolvers = require('./resolvers.js');
const typeDefs = fs.readFileSync(schemaPath).toString();

// Setup http
const app = express();
const { authRouter, authenticate } = require('./authentication.js');

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        return req.auth;
    },
});

(async function start() {
    app.use('/auth', authRouter);
    app.use('', expressStaticGzip(distPath));

    await apolloServer.start();

    app.use('/gql', authenticate);
    apolloServer.applyMiddleware({ app, path: '/gql' });

    // Redirect everything else to the SPA
    // gzip for index not needed (its already small)
    app.use('*', express.static(path.resolve(distPath, 'index.html')));

    app.listen({ port: 3000 }, () => {
        console.log('Server started: http://localhost:3000/');
    });
})();
