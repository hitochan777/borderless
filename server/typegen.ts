/**
 * This file was automatically generated by Nexus 0.11.7
 * Do not make changes to this file directly
 */

import * as ctx from "./types"
import * as entity_line from "./entity/line"
import * as entity_post from "./entity/post"
import * as entity_tweet from "./entity/tweet"
import * as entity_user from "./entity/user"


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  LineInput: { // input type
    comment?: string | null; // String
    text: string; // String!
  }
  PostInput: { // input type
    content: string; // String!
    isDraft: boolean; // Boolean!
    language: number; // Int!
  }
  UserInput: { // input type
    email: string; // String!
    fluentLanguages: number[]; // [Int!]!
    learningLanguages: number[]; // [Int!]!
    username: string; // String!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  AuthData: { // root type
    token: string; // String!
  }
  Language: { // root type
    id: string; // ID!
    name: string; // String!
  }
  Line: entity_line.Line;
  Mutation: {};
  PartialLine: { // root type
    text: string; // String!
  }
  Post: entity_post.Post;
  Query: {};
  Tweet: entity_tweet.Tweet;
  User: entity_user.User;
  Node: NexusGenRootTypes['Post'] | NexusGenRootTypes['Language'] | NexusGenRootTypes['Line'] | NexusGenRootTypes['Tweet'] | NexusGenRootTypes['User'];
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  Repliable: NexusGenRootTypes['Line'] | NexusGenRootTypes['Tweet'];
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  LineInput: NexusGenInputs['LineInput'];
  PostInput: NexusGenInputs['PostInput'];
  UserInput: NexusGenInputs['UserInput'];
}

export interface NexusGenFieldTypes {
  AuthData: { // field return type
    token: string; // String!
  }
  Language: { // field return type
    id: string; // ID!
    name: string; // String!
  }
  Line: { // field return type
    id: string; // ID!
    partialLines: NexusGenRootTypes['PartialLine'][]; // [PartialLine!]!
    replies: NexusGenRootTypes['Tweet'][]; // [Tweet!]!
  }
  Mutation: { // field return type
    logout: boolean; // Boolean!
    postCreate: NexusGenRootTypes['Post']; // Post!
    postUpdate: NexusGenRootTypes['Post']; // Post!
    signin: NexusGenRootTypes['AuthData']; // AuthData!
    userCreate: NexusGenRootTypes['User']; // User!
    userUpdate: NexusGenRootTypes['User']; // User!
  }
  PartialLine: { // field return type
    text: string; // String!
  }
  Post: { // field return type
    id: string; // ID!
    isDraft: boolean; // Boolean!
    json: string; // String!
    language: NexusGenRootTypes['Language']; // Language!
    lines: NexusGenRootTypes['Line'][]; // [Line!]!
    title: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    feed: NexusGenRootTypes['Post'][]; // [Post!]!
    langs: NexusGenRootTypes['Language'][]; // [Language!]!
    post: NexusGenRootTypes['Post']; // Post!
    posts: NexusGenRootTypes['Post'][]; // [Post!]!
    tweet: NexusGenRootTypes['Tweet']; // Tweet!
    viewer: NexusGenRootTypes['User']; // User!
  }
  Tweet: { // field return type
    id: string; // ID!
    inReplyTo: number | null; // Int
    replies: NexusGenRootTypes['Tweet'][]; // [Tweet!]!
    text: string; // String!
    userId: number; // Int!
  }
  User: { // field return type
    email: string; // String!
    fluentLanguages: number[]; // [Int!]!
    id: string; // ID!
    learningLanguages: number[]; // [Int!]!
    posts: NexusGenRootTypes['Post'][]; // [Post!]!
    username: string; // String!
  }
  Node: { // field return type
    id: string; // ID!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    postCreate: { // args
      post: NexusGenInputs['PostInput']; // PostInput!
    }
    postUpdate: { // args
      id: number; // Int!
      post: NexusGenInputs['PostInput']; // PostInput!
    }
    signin: { // args
      token: string; // String!
    }
    userCreate: { // args
      id: string; // String!
    }
    userUpdate: { // args
      id: string; // String!
      user: NexusGenInputs['UserInput']; // UserInput!
    }
  }
  Query: {
    feed: { // args
      uid: string; // String!
    }
    post: { // args
      id: number; // Int!
    }
    tweet: { // args
      id: number; // Int!
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
  Repliable: "Line" | "Tweet"
  Node: "Post" | "Language" | "Line" | "Tweet" | "User"
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthData" | "Language" | "Line" | "Mutation" | "PartialLine" | "Post" | "Query" | "Tweet" | "User";

export type NexusGenInputNames = "LineInput" | "PostInput" | "UserInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = "Node";

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = "Repliable";

export interface NexusGenTypes {
  context: ctx.GraphQLContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}