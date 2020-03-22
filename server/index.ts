import { ApolloServer } from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import cookie from "cookie";

import { GraphQLContext, RepositoryContainer, ServiceContainer } from "./types";
import { schema } from "./schema";
import {
  UserRepository,
  PostRepository,
  TweetRepository,
  LineMarkerRepository,
  CorrectionGroupRepository
} from "./infra/persistent/prisma";
import { SlateService } from "./infra/service/slate_service";
import { PrismaClient } from "@prisma/client";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: process.env.FIREBASE_CREDENTIAL
      ? admin.credential.cert(
          JSON.parse(
            Buffer.from(process.env.FIREBASE_CREDENTIAL, "base64").toString(
              "utf-8"
            )
          )
        )
      : admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

export const buildRepositoryContainer = (): RepositoryContainer => {
  const driver = new PrismaClient();
  return {
    userRepository: new UserRepository(driver),
    postRepository: new PostRepository(driver),
    tweetRepository: new TweetRepository(driver),
    lineMarkerRepository: new LineMarkerRepository(driver),
    corretionGroupRepository: new CorrectionGroupRepository(driver)
  };
};

export const buildServiceContainer = (): ServiceContainer => {
  return {
    editorService: new SlateService()
  };
};

const getUidFromCookie = async (
  sessionCookie: string | undefined
): Promise<string | null> => {
  if (sessionCookie) {
    const decodedIdToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie);
    return decodedIdToken.uid; // eslint-disable-line require-atomic-updates
  }
  return null;
};

const extractToken = (authorization: string) => {
  if (authorization !== "") {
    const authElements = authorization.split(" ");
    if (authElements.length === 2) {
      return authElements[1];
    }
  }
  return "";
};

const getUidFromAuthorization = async (
  authorization: string | undefined
): Promise<string | null> => {
  if (authorization) {
    const sessionCookie = extractToken(authorization);
    const decodedIdToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    return decodedIdToken.uid;
  }
  return null;
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
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<GraphQLContext> => {
  let uid = await getUidFromAuthorization(req.headers.authorization);
  if (!uid) {
    if (!req.headers.cookie) {
      uid = null;
    } else {
      uid = await getUidFromCookie(cookie.parse(req.headers.cookie)["session"]);
    }
  }
  return {
    uid,
    res,
    repositories,
    services
  };
};

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
    playground: process.env.NODE_ENV !== "production",
    tracing: true
  });
  return server;
};

const createHandler = async () => {
  const server = await createServer();
  return server.createHandler();
};

export default createHandler();
