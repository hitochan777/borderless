import firebase from "firebase/app";
import "firebase/auth";
import { useEffect, useContext } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import {
  useSetLoadingMutation,
  useSetErrorMessageMutation
} from "@/generated/types";
import { UidContext } from "@/context";

const SIGNIN = gql`
  mutation signin($token: String!) {
    signin(token: $token) {
      token
    }
  }
`;

export const useAuthEffect = () => {
  const { setUid } = useContext(UidContext);
  const [setLoading] = useSetLoadingMutation();
  const [setErrorMessage] = useSetErrorMessageMutation();
  const [signin] = useMutation(SIGNIN);
  const router = useRouter();

  const login = async () => {
    const result = await firebase.auth().getRedirectResult();
    if (result.user) {
      const token = await result.user.getIdToken();
      // FIXME: const csrfToken = getCookie("csrfToken");
      await signin({ variables: { token } });
      setUid(result.user.uid);
      router.push("/");
    }
  };

  useEffect(() => {
    setLoading({ variables: { loading: true } });
    login()
      .catch(_e => {
        setErrorMessage({ variables: { errorMessage: "Failed to login" } });
      })
      .finally(() => {
        setLoading({ variables: { loading: false } });
      });
  }, []);
};
