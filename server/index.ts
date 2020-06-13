import { ApolloServer } from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";
import cookie from "cookie";

import { GraphQLContext, ServiceContainer } from "./types";
import { schema } from "./schema";
import {
  PrismaUserRepository,
  PrismaPostRepository,
  PrismaTweetRepository,
  PrismaLineMarkerRepository,
  PrismaCorrectionGroupRepository,
} from "./infra/persistent/prisma";
import { SlateService } from "./infra/service/slate_service";
import { PrismaClient } from "@prisma/client";
import { RepositoryContainer } from "./domain/repository";

const isDev = process.env.NODE_ENV !== "production";

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
    databaseURL: "database URL here",
  });
}

export const buildRepositoryContainer = (): RepositoryContainer => {
  const driver = new PrismaClient({
    log: ["query", "info"],
  });

  driver.on("query" as never, (e: any) => {
    e.timestamp;
    e.query;
    e.params;
    e.duration;
    e.target;
    console.log(e);
  });
  return {
    userRepository: new PrismaUserRepository(driver),
    postRepository: new PrismaPostRepository(driver),
    tweetRepository: new PrismaTweetRepository(driver),
    lineMarkerRepository: new PrismaLineMarkerRepository(driver),
    corretionGroupRepository: new PrismaCorrectionGroupRepository(driver),
  };
};

export const buildServiceContainer = (): ServiceContainer => {
  return {
    editorService: new SlateService(),
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
  services,
}: {
  repositories: RepositoryContainer;
  services: ServiceContainer;
}) => async ({
  req,
  res,
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
  console.log(`Request from ${uid}`);
  return {
    uid,
    res,
    repositories,
    services,
  };
};

const createServer = async () => {
  const repositories = buildRepositoryContainer();
  const services = buildServiceContainer();
  const context = createContext({ repositories, services });
  const server = new ApolloServer({
    schema,
    context,
    formatResponse: (response) => {
      if (!response) {
        throw new Error("response is null");
      }
      console.info(response);
      return response;
    },
    playground: isDev,
    tracing: isDev,
  });
  return server;
};

const createHandler = async () => {
  const server = await createServer();
  return server.createHandler();
};

export default createHandler();
