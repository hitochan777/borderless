import express, { Response, Request } from "express";
import admin from "firebase-admin";
import next from "next";
import proxy from "http-proxy-middleware";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "database URL here"
  });
}

const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const withAuthHandler = (handler: any) => async (
  req: Request,
  res: Response
) => {
  try {
    const sessionCookie = req.cookies && req.cookies.session;
    if (sessionCookie) {
      const decodedIdToken = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
      req.headers["uid"] = decodedIdToken.uid; // eslint-disable-line require-atomic-updates
    }
  } catch (error) {
    res.clearCookie("session");
  }
  return handler(req, res);
};

const GRAPHQL_PATH = "/graphql";
const GRAPHQL_ENDPOINT = "http://localhost:3001";

const runServer = async () => {
  const nextApp = next({ dev });
  const nextAppHandler = nextApp.getRequestHandler();
  await nextApp.prepare();
  const server = express();

  if (dev) {
    server.use(
      GRAPHQL_PATH,
      proxy({ target: GRAPHQL_ENDPOINT, changeOrigin: true })
    );
  }
  server.get(
    "*",
    bodyParser.json(),
    cors(),
    cookieParser(),
    withAuthHandler(nextAppHandler)
  );

  server.listen(port, () => console.log("Server Listening on Port", port));
};

runServer();
