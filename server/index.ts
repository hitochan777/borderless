import {
  ApolloServer,
  gql,
  addMockFunctionsToSchema
} from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import { parse } from "cookie";

import { schema } from "./schema";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

export const createContext = () => async ({
  req,
  res
}: {
  req: ExtendedServerRequest;
  res: ServerResponse;
}) => {
  let user = null;
  const sessionCookie = (req.cookies && req.cookies.session) || "";
  try {
    user = await admin.auth().verifySessionCookie(sessionCookie, true);
  } catch (error) {}
  return { user, res };
};

// addMockFunctionsToSchema({ schema });

const createServer = async () => {
  const context = await createContext();
  const server = new ApolloServer({
    schema,
    context,
    formatResponse: (response: ServerResponse) => {
      console.log(response);
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
