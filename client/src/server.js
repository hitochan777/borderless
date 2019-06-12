import sirv from "sirv";
import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import * as sapper from "@sapper/server";
import { writable } from "svelte/store";
import * as admin from "firebase-admin";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://polyglot-3f093.firebaseio.com"
});

function createStore() {
  const initialState = {
    user: 1
  };
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    loginUser: user => update(state => ({ ...state, user })),
    reset: () => set(initialState)
  };
}

const app = express();

app
  .use(
    json(),
    cookieParser(),
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware({
      session: async (req, res) => {
        const sessionCookie = req.cookies.session || "";
        try {
          console.log(req);
          const user = await admin
            .auth()
            .verifySessionCookie(sessionCookie, true);
        } catch (error) {
          return { user: null };
        }
        return { user: "some value" };
      }
    })
  )
  .listen(PORT, err => {
    if (err) {
      console.log("error", err);
    }
  });
