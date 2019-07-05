import { router, get, post, ServerRequest, ServerResponse } from "microrouter";
import next from "next";
import httpProxy from "http-proxy";

const dev = process.env.NODE_ENV !== "production";

const proxy = httpProxy.createProxyServer();

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const GRAPHQL_PATH = "/graphql";
const GRAPHQL_ENDPOINT = "http://localhost:3001";

const graphqlProxyHandler = (req: ServerRequest, res: ServerResponse): any => {
  proxy.web(req, res, { target: GRAPHQL_ENDPOINT }, err => {
    console.error(err);
  });
};

const createHandler = async () => {
  await nextApp.prepare();

  return router(
    post(GRAPHQL_PATH, graphqlProxyHandler),
    get(GRAPHQL_PATH, graphqlProxyHandler),
    get("*", nextHandler)
  );
};

export default createHandler();
