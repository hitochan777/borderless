import {
  router,
  get,
  post,
  ServerRequest as MicroServerRequest,
  ServerResponse as MicroServerResponse
} from "microrouter";
import httpProxy from "http-proxy";
import admin from "firebase-admin";
import { IncomingMessage, ServerResponse } from "http";
import * as cookie from "cookie";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

const proxy = httpProxy.createProxyServer();

const clearCookie = (res: MicroServerResponse, key: string) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(key, "", { expires: new Date() })
  );
};

const withAuthHandler = (handler: any) => async (
  req: ExtendedServerRequest,
  res: MicroServerResponse,
  ...restArgs: any[]
) => {
  try {
    const sessionCookie = req.cookies && req.cookies.session;
    if (sessionCookie) {
      const decodedIdToken = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
      req.headers["uid"] = decodedIdToken.uid;
    }
  } catch (error) {
    clearCookie(res, "session");
  }
  return handler(req, res, ...restArgs);
};

const GRAPHQL_PATH = "/graphql";
const GRAPHQL_ENDPOINT = "http://localhost:3001";
const FRONT_APP_ENDPOINT = "http://localhost:3002";

const graphqlProxyHandler = (
  req: MicroServerRequest,
  res: MicroServerResponse
): any => {
  proxy.web(req, res, { target: GRAPHQL_ENDPOINT }, err => {
    console.error(err);
  });
};

const frontAppProxyHandler = (
  req: MicroServerRequest,
  res: MicroServerResponse
): any => {
  proxy.web(req, res, { target: FRONT_APP_ENDPOINT }, err => {
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

const withCookie = (handler: Handler) => (
  req: ExtendedServerRequest,
  res: ServerResponse,
  ...restArgs: any[]
) => {
  const cookies = cookie.parse((req.headers && req.headers.cookie) || "");
  req.cookies = cookies;
  return handler(req, res, ...restArgs);
};

const createHandler = async () => {
  const routedHandler = router(
    post(GRAPHQL_PATH, graphqlProxyHandler),
    get(GRAPHQL_PATH, graphqlProxyHandler),
    get("*", withAuthHandler(frontAppProxyHandler))
  );
  return withCookie(routedHandler);
};
export default createHandler();
