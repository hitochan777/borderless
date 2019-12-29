import { ApolloServer } from "apollo-server-micro";
import { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";

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

const getUidFromHeader = (header: string | undefined): string | null => {
  if (!header) {
    return null;
  }
  const ascii = new Buffer(header, "base64").toString("utf-8");

  const payload: {
    issuer?: string;
    id?: string;
    email?: string;
  } = JSON.parse(ascii);
  if (!payload.id) {
    return null;
  }
  return payload.id;
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
  const uid = getUidFromHeader(
    req.headers["x-endpoint-api-userinfo"] as string | undefined
  );
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
    playground: process.env.NODE_ENV !== "production"
  });
  return server;
};

const createHandler = async () => {
  const server = await createServer();
  return server.createHandler();
};

export default createHandler();
