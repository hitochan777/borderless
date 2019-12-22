import { ApolloServer } from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import { parse } from "cookie";

import { GraphQLContext, RepositoryContainer, ServiceContainer } from "./types";
import { schema } from "./schema";
import { UserRepository } from "./infra/persistent/prisma/user_repository";
import { PostRepository } from "./infra/persistent/prisma/post_repository";
import { TweetRepository } from "./infra/persistent/prisma/tweet_repository";
import { LineMarkerRepository } from "./infra/persistent/prisma/line_marker_repository";
import { SlateService } from "./infra/service/slate_service";
import { Photon } from "@prisma/photon";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://polyglot-3f093.firebaseio.com"
  });
}

export const buildRepositoryContainer = (): RepositoryContainer => {
  const driver = new Photon({
    debug: process.env.DEBUG
  });
  return {
    userRepository: new UserRepository(driver),
    postRepository: new PostRepository(driver),
    tweetRepository: new TweetRepository(driver),
    lineMarkerRepository: new LineMarkerRepository(driver)
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

export const createContext = ({
  repositories,
  services
}: {
  repositories: RepositoryContainer;
  services: ServiceContainer;
}) => async ({
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
    repositories,
    services
  };
};

// addMockFunctionsToSchema({ schema });

const createServer = async () => {
  const repositories = buildRepositoryContainer();
  const services = buildServiceContainer();
  const context = createContext({ repositories, services });
  const server = new ApolloServer({
    schema,
    context,
    formatResponse: response => {
      if (!response) {
        throw new Error("response is null");
      }
      console.info(response);
      return response;
    },
    playground: process.env.NODE_ENV !== "production"
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
