import { ApolloServer } from "apollo-server-micro";
import { GraphQLResponse } from "apollo-server-types";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import { parse } from "cookie";
import knex from "knex";

import { GraphQLContext, RepositoryContainer, ServiceContainer } from "./types";
import db from "./db";
import { schema } from "./schema";
import { UserRepository } from "./infra/user_repository";
import { PostRepository } from "./infra/post_repository";
import { TweetRepository } from "./infra/tweet_repository";
import { LineMarkerRepository } from "./infra/line_marker_repository";
import { SlateService } from "./infra/slate_service";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

export const buildRepositoryContainer = (db: knex): RepositoryContainer => {
  return {
    userRepository: new UserRepository(db),
    postRepository: new PostRepository(db),
    tweetRepository: new TweetRepository(db),
    lineMarkerRepository: new LineMarkerRepository(db)
  };
};

export const buildServiceContainer = (): ServiceContainer => {
  return {
    editorService: new SlateService()
  };
};

const extractToken = (
  maybeAuthorization?: string,
  maybeSessionCookie?: string
) => {
  if (maybeAuthorization && maybeSessionCookie) {
    return "";
  }
  const authorization = maybeAuthorization || "";
  if (authorization !== "") {
    const authElements = authorization.split(" ");
    if (authElements.length === 2) {
      return authElements[1];
    }
  }
  const sessionCookie = maybeSessionCookie || "";
  if (sessionCookie !== "") {
    return sessionCookie;
  }
  return "";
};

export const createContext = (db: knex) => async ({
  req,
  res
}: {
  req: ExtendedServerRequest;
  res: ServerResponse;
}): Promise<GraphQLContext> => {
  let uid = null;
  const token = extractToken(
    req.headers.authorization,
    req.cookies && req.cookies["session"]
  );
  if (token !== "") {
    const user = await admin.auth().verifySessionCookie(token, true);
    uid = user.uid;
  }
  return {
    uid,
    res,
    repositories: buildRepositoryContainer(db),
    services: buildServiceContainer()
  };
};

// addMockFunctionsToSchema({ schema });

const createServer = async () => {
  const context = createContext(db);
  const server = new ApolloServer({
    schema,
    context,
    formatResponse: response => {
      if (!response) {
        throw new Error("response is null");
      }
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
