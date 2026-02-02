import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import express from 'express';

export const createApolloServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
  });

  return server;
};

export const createGraphQLMiddleware = (server: ApolloServer) => {
  return expressMiddleware(server, {
    context: async ({ req }: { req: express.Request }) => {
      return {
        req,
      };
    },
  });
};
