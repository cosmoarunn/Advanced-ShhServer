const { gql } = require('apollo-server');

module.exports = gql`
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
  ) on FIELD_DEFINITION | OBJECT | INTERFACE
  directive @specifiedBy(url: String!) on SCALAR
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  type Counter {
    count: Int!
    countStr: String
  }

  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  scalar JSON

  type Message {
    id: ID!
    text: String!
  }

  input MessageInput {
    text: String!
  }

  type Mutation {
    myMutation: String!
    addMessage(input: MessageInput!): Message!
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
  }

  type Query {
    hello(name: String): String!
    messages: [Message]
    uploads: [File]
  }

  type Subscription {
    mySub: String!
    counter: Counter!
    messageAdded: Message!
  }

  scalar Upload

  type User {
    id: ID!
    name: UserFullName!
  }

  type UserFullName {
    firstName: String!
    middleName: String
    lastName: String!
  }


`;