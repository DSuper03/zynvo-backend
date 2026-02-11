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
    users: [User!]!
    user(id: String!): User
    usersByEmail(emails: [String!]!): [User!]!
    usersByCollege(collegeName: String!): [User!]!
    emailsByCollege(collegeName: String!): [String!]!
    verifiedUsers: [User!]!
  }

  type Mutation {
    updateUserVerification(userId: String!, isVerified: Boolean!): User!
  }
`;
