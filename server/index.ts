import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import { parse } from "cookie";

import { GraphQLContext } from "./types";
import { schema } from "./schema";
import { RepositoryContainer } from "./types";
import { createConnection } from "typeorm";

import { User } from "./entity/user";
import { Post } from "./entity/post";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

const buildRepositoryContainer = async (): Promise<RepositoryContainer> => {
  const connection = await createConnection();

  return {
    userRepository: connection.getRepository<User>(User),
    postRepository: connection.getRepository<Post>(Post)
  };
};

export const createContext = async () => {
  const repositories = await buildRepositoryContainer();

  return async ({
    req,
    res
  }: {
    req: ExtendedServerRequest;
    res: ServerResponse;
  }): Promise<GraphQLContext> => {
    let uid = null;
    const sessionCookie = (req.cookies && req.cookies.session) || "";
    if (sessionCookie !== "") {
      const user = await admin.auth().verifySessionCookie(sessionCookie, true);
      uid = user.uid;
    }
    return {
      uid: "CgJgvBcQB3ajIdJ3wJF5qFqt2yq1",
      res,
      repositories
    };
  };
};

// addMockFunctionsToSchema({ schema });

const createServer = async () => {
  const context = await createContext();
  const server = new ApolloServer({
    schema,
    context,
    formatResponse: (response: ServerResponse) => {
      console.info(response);
      return response;
    }
  });
  return server;
};

type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  ...restArgs: any[]
) => void;
type ExtendedServerRequest = IncomingMessage & {
  cookies?: { [key: string]: string };
};

const cookie = (handler: Handler) => (
  req: ExtendedServerRequest,
  res: ServerResponse,
  ...restArgs: any[]
) => {
  const cookies = parse((req.headers && req.headers.cookie) || "");
  req.cookies = cookies;
  return handler(req, res, ...restArgs);
};

const createHandler = async () => {
  const server = await createServer();
  return cookie(server.createHandler());
};

export default createHandler();
