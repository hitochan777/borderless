import firebase from "firebase";
import { useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import { useStateValue } from "@/store";

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
  const [signin] = useMutation(SIGNIN);
  const router = useRouter();

  useAsyncEffect(async () => {
    const result = await firebase.auth().getRedirectResult();
    if (result.user) {
      setLoading(true);
      const token = await result.user.getIdToken();
      // FIXME: const csrfToken = getCookie("csrfToken");
      await signin({ variables: { token } });
      setUser(result.user.uid);
      setLoading(false);
      router.push("/");
    }
  });
};
