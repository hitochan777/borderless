import firebase from "firebase";
import { useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useSetUidMutation, useSetLoadingMutation } from "@/generated/types";

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
  const [setUid] = useSetUidMutation();
  const [setLoading] = useSetLoadingMutation();
  const [signin] = useMutation(SIGNIN);
  const router = useRouter();

  useAsyncEffect(async () => {
    const result = await firebase.auth().getRedirectResult();
    if (result.user) {
      setLoading({ variables: { loading: true } });
      const token = await result.user.getIdToken();
      // FIXME: const csrfToken = getCookie("csrfToken");
      await signin({ variables: { token } });
      setUid({ variables: { uid: result.user.uid } });
      setLoading({ variables: { loading: false } });
      router.push("/");
    }
  });
};
