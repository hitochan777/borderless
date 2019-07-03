import { router, get, post, ServerRequest, ServerResponse } from "microrouter";
import next from "next";
import httpProxy from "http-proxy";

const dev = process.env.NODE_ENV !== "production";

let globalRes: any;

const proxy = httpProxy.createProxyServer();
proxy.on("proxyRes", function(proxyRes, _, res) {
  let body = new Buffer("");
  proxyRes.on("data", function(data) {
    body = Buffer.concat([body, data]);
  });
  proxyRes.on("end", function() {
    const bodyString = body.toString();
    console.log("res from proxied server:", bodyString);
    res.end(bodyString);
  });
});

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const GRAPHQL_PATH = "/graphql";
const GRAPHQL_ENDPOINT = "http://localhost:3001";

const graphqlProxyHandler = (req: ServerRequest, res: ServerResponse): any => {
  globalRes = res;
  proxy.web(
    req,
    res,
    { target: GRAPHQL_ENDPOINT, selfHandleResponse: true },
    err => {
      console.error(err);
    }
  );
};

const createHandler = async () => {
  await nextApp.prepare();

  return router(
    get(GRAPHQL_PATH, graphqlProxyHandler),
    post(GRAPHQL_PATH, graphqlProxyHandler),
    get("*", nextHandler)
  );
};

export default createHandler();
