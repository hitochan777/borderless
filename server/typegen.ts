/**
 * This file was automatically generated by Nexus 0.11.7
 * Do not make changes to this file directly
 */

import * as ctx from "./types";

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  PostInput: {
    // input type
    language: number; // Int!
    text: string; // String!
  };
  UserInput: {
    // input type
    email?: string | null; // String
    fluentLanguages?: string[] | null; // [String!]
    learningLanguages?: string[] | null; // [String!]
    username?: string | null; // String
  };
}

export interface NexusGenEnums {}

export interface NexusGenRootTypes {
  AuthData: {
    // root type
    token: string; // String!
  };
  Language: {
    // root type
    id: string; // ID!
    name: string; // String!
  };
  Line: {
    // root type
    id: string; // ID!
    post: NexusGenRootTypes["Post"]; // Post!
    text: string; // String!
    tweets: NexusGenRootTypes["Tweet"][]; // [Tweet!]!
  };
  Mutation: {};
  Post: {
    // root type
    id: string; // ID!
    language: number; // Int!
    text: string; // String!
    userId: string; // String!
  };
  Query: {};
  Tweet: {
    // root type
    id: string; // ID!
    inReplyTo: NexusGenRootTypes["Repliable"]; // Repliable!
    replies: NexusGenRootTypes["Tweet"][]; // [Tweet!]!
    text: string; // String!
  };
  User: {
    // root type
    email: string; // String!
    fluentLanguages: number[]; // [Int!]!
    id: string; // ID!
    learningLanguages: number[]; // [Int!]!
    username: string; // String!
  };
  Node:
    | NexusGenRootTypes["Language"]
    | NexusGenRootTypes["Post"]
    | NexusGenRootTypes["User"]
    | NexusGenRootTypes["Line"]
    | NexusGenRootTypes["Tweet"];
  Repliable: NexusGenRootTypes["Line"] | NexusGenRootTypes["Tweet"];
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  PostInput: NexusGenInputs["PostInput"];
  UserInput: NexusGenInputs["UserInput"];
}

export interface NexusGenFieldTypes {
  AuthData: {
    // field return type
    token: string; // String!
  };
  Language: {
    // field return type
    id: string; // ID!
    name: string; // String!
  };
  Line: {
    // field return type
    id: string; // ID!
    post: NexusGenRootTypes["Post"]; // Post!
    text: string; // String!
    tweets: NexusGenRootTypes["Tweet"][]; // [Tweet!]!
  };
  Mutation: {
    // field return type
    logout: boolean; // Boolean!
    postCreate: NexusGenRootTypes["Post"]; // Post!
    signin: NexusGenRootTypes["AuthData"]; // AuthData!
    userCreate: NexusGenRootTypes["User"]; // User!
    userUpdate: NexusGenRootTypes["User"]; // User!
  };
  Post: {
    // field return type
    id: string; // ID!
    language: number; // Int!
    text: string; // String!
    userId: string; // String!
  };
  Query: {
    // field return type
    langs: NexusGenRootTypes["Language"][]; // [Language!]!
    post: NexusGenRootTypes["Post"]; // Post!
    posts: NexusGenRootTypes["Post"][]; // [Post!]!
    viewer: NexusGenRootTypes["User"]; // User!
  };
  Tweet: {
    // field return type
    id: string; // ID!
    inReplyTo: NexusGenRootTypes["Repliable"]; // Repliable!
    replies: NexusGenRootTypes["Tweet"][]; // [Tweet!]!
    text: string; // String!
  };
  User: {
    // field return type
    email: string; // String!
    fluentLanguages: number[]; // [Int!]!
    id: string; // ID!
    learningLanguages: number[]; // [Int!]!
    posts: NexusGenRootTypes["Post"][]; // [Post!]!
    username: string; // String!
  };
  Node: {
    // field return type
    id: string; // ID!
  };
  Repliable: {
    // field return type
    text: string; // String!
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    postCreate: {
      // args
      post: NexusGenInputs["PostInput"]; // PostInput!
    };
    signin: {
      // args
      token: string; // String!
    };
    userCreate: {
      // args
      id: string; // String!
    };
    userUpdate: {
      // args
      id: string; // String!
      user: NexusGenInputs["UserInput"]; // UserInput!
    };
  };
  Query: {
    post: {
      // args
      id: number; // Int!
    };
  };
}

export interface NexusGenAbstractResolveReturnTypes {
  Node: "Language" | "Post" | "User" | "Line" | "Tweet";
  Repliable: "Line" | "Tweet";
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames =
  | "AuthData"
  | "Language"
  | "Line"
  | "Mutation"
  | "Post"
  | "Query"
  | "Tweet"
  | "User";

export type NexusGenInputNames = "PostInput" | "UserInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = "Node" | "Repliable";

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

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
  allInputTypes:
    | NexusGenTypes["inputNames"]
    | NexusGenTypes["enumNames"]
    | NexusGenTypes["scalarNames"];
  allOutputTypes:
    | NexusGenTypes["objectNames"]
    | NexusGenTypes["enumNames"]
    | NexusGenTypes["unionNames"]
    | NexusGenTypes["interfaceNames"]
    | NexusGenTypes["scalarNames"];
  allNamedTypes:
    | NexusGenTypes["allInputTypes"]
    | NexusGenTypes["allOutputTypes"];
  abstractTypes: NexusGenTypes["interfaceNames"] | NexusGenTypes["unionNames"];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}
