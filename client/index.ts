import {
  router,
  get,
  post,
  ServerRequest as MicroServerRequest,
  ServerResponse as MicroServerResponse
} from "microrouter";
import next from "next";
import httpProxy from "http-proxy";
import admin from "firebase-admin";
import { IncomingMessage, ServerResponse } from "http";
import { parse } from "cookie";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

const dev = process.env.NODE_ENV !== "production";

const proxy = httpProxy.createProxyServer();

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const withAuthHandler = (handler: any) => async (
  req: any,
  res: any,
  ...restArgs: any[]
) => {
  try {
    const sessionCookie = req.cookies.session || "";
    const decodedIdToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    req.decodedIdToken = decodedIdToken;
  } catch (error) {
    console.log(error)
  }
  return handler(req, res, ...restArgs);
};

const GRAPHQL_PATH = "/graphql";
const GRAPHQL_ENDPOINT = "http://localhost:3001";

const graphqlProxyHandler = (
  req: MicroServerRequest,
  res: MicroServerResponse
): any => {
  proxy.web(req, res, { target: GRAPHQL_ENDPOINT }, err => {
    console.error(err);
  });
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
  await nextApp.prepare();

  const routedHandler = router(
    post(GRAPHQL_PATH, graphqlProxyHandler),
    get(GRAPHQL_PATH, graphqlProxyHandler),
    get("*", withAuthHandler(nextHandler))
  );
  return cookie(routedHandler)
};
export default createHandler()
