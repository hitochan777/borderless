import * as firebase from "firebase";
import Router from "next/router";
import { useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import { useStateValue } from "./store";

export function useAsyncEffect(effect: () => Promise<any>) {
  useEffect(() => {
    effect().catch(e => console.warn("useAsyncEffect error", e));
  }, []);
}

const SIGNIN = gql`
  mutation signin($token: String!) {
    signin(token: $token) {
      token
    }
  }
`;

export const useAuthEffect = () => {
  const { state, actions } = useStateValue();
  const { currentUser } = state;
  const { setCurrentUser, setLoading, setTmpUser } = actions;
  const signin = useMutation(SIGNIN);

  useAsyncEffect(async () => {
    const result = await firebase.auth().getRedirectResult();
    if (result.user) {
      const token = await result.user.getIdToken();
      // FIXME: const csrfToken = getCookie("csrfToken");
        await signin({ variables: { token } });
    }
    firebase.auth().onAuthStateChanged(async user => {
      setTmpUser(user && user.uid);
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
      setCurrentUser(user && user.uid);
      setLoading(false);
    });
  });
};
