import * as firebase from "firebase";
import Router from "next/router";
import { useEffect } from "react";

import { useStateValue } from "./store";

const ky = require("ky/umd");

export function useAsyncEffect(effect: () => Promise<any>) {
  useEffect(() => {
    effect().catch(e => console.warn("useAsyncEffect error", e));
  });
}

export const useAuthEffect = () => {
  const { state, actions } = useStateValue();
  const { currentUser } = state;
  const { setCurrentUser, setLoading, setTmpUser } = actions;

  useAsyncEffect(async () => {
    const result = await firebase.auth().getRedirectResult();
    if (result.user) {
      const token = await result.user.getIdToken();
      // FIXME: const csrfToken = getCookie("csrfToken");
      await ky.post("login.json", { json: { token } });
    }

    firebase.auth().onAuthStateChanged(async user => {
      setTmpUser(user);
      if (user) {
        if (!currentUser) {
          setLoading(false);
          if (Router.pathname === "/signup") {
            //avoiding infinite loop
            return;
          }

          Router.push("/signup");
          return;
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });
  });
};
