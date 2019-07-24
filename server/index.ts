import { ApolloServer } from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import { parse } from "cookie";
import knex from "knex";

import { GraphQLContext } from "./types";
import db from "./db";
import { schema } from "./schema";
import { RepositoryContainer } from "./types";
import { UserRepository } from "./infra/user_repository";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

const buildRepositoryContainer = (db: knex): RepositoryContainer => {
  return {
    userRepository: new UserRepository(db)
  };
};

export const createContext = (db: knex) => async ({
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
  return { uid, res, repositories: buildRepositoryContainer(db) };
};

// addMockFunctionsToSchema({ schema });

const createServer = async () => {
  const context = await createContext(db);
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
