import express, { Response, Request } from "express";
import admin from "firebase-admin";
import next from "next";
import proxy from "http-proxy-middleware";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

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

const getUidFromCookie = async (req: Request): Promise<string | null> => {
  const sessionCookie = req.cookies && req.cookies.session;
  if (sessionCookie) {
    const decodedIdToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie);
    return decodedIdToken.uid; // eslint-disable-line require-atomic-updates
  }
  return null;
};

const withAuthHandler = (handler: any) => async (
  req: Request,
  res: Response
) => {
  try {
    const uid = await getUidFromCookie(req);
    if (uid) {
      req.headers["uid"] = uid;
    }
  } catch (error) {
    console.log(error);
    if (error.code === "app/network-error") {
      console.log(
        "Network error occurred. Make sure Next.js server is no connected to the internet"
      );
    } else {
      res.clearCookie("session");
    }
  }
  return handler(req, res);
};

const runServer = async () => {
  const nextApp = next({ dev });
  const nextAppHandler = nextApp.getRequestHandler();
  await nextApp.prepare();
  const server = express();

  server.get("/favicon.ico", (_, res) => {
    res.status(404).send("Not Found");
  });

  if (dev) {
    /*
     * In development mode, this server also serves as a proxy for backend GraphQL server.
     * It simulates the data passed by Google Cloud Endpoint
     */
    const GRAPHQL_PATH = "/graphql";
    const GRAPHQL_ENDPOINT = "http://localhost:3001";
    server.use(
      GRAPHQL_PATH,
      proxy(GRAPHQL_ENDPOINT, {
        changeOrigin: true
      })
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
