import * as firebase from "firebase";
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
  const { actions } = useStateValue();
  const { setUser, setLoading } = actions;
  const signin = useMutation(SIGNIN);

  useAsyncEffect(async () => {
    const result = await firebase.auth().getRedirectResult();
    if (result.user) {
      const token = await result.user.getIdToken();
      // FIXME: const csrfToken = getCookie("csrfToken");
      await signin({ variables: { token } });
    }
    firebase.auth().onAuthStateChanged(async user => {
      setLoading(true);
      console.log("onAuthStateChanged called", user);
      setUser(user && user.uid);
      setLoading(false);
    });
  });
};
