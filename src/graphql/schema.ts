import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: String!
    email: String!
    name: String
    collegeName: String
    isVerified: Boolean
    clubName: String
    createdAt: String
  }

  type Query {
    users(limit: Int, skip: Int): [User!]!
    user(id: String!): User
    usersByEmail(emails: [String!]!): [User!]!
    usersByCollege(collegeName: String!, limit: Int, skip: Int): [User!]!
    emailsByCollege(collegeName: String!, limit: Int, skip: Int): [String!]!
    verifiedUsers(limit: Int, skip: Int): [User!]!
  }

  type Mutation {
    updateUserVerification(userId: String!, isVerified: Boolean!): User!
  }
`;
