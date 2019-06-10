import sirv from "sirv";
import polka from "polka";
import { json } from "body-parser";
import compression from "compression";
import * as sapper from "@sapper/server";
import * as admin from "firebase-admin";
import { writable } from "svelte/store";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

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

polka() // You can also use Express
  .use(
    json(),
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware({
      session: (req, res) => {
        return { user: null };
      }
    })
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
