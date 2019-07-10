import * as firebase from "firebase";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";

import { State, User } from "./state";

export interface Context {
  apolloClient: ApolloClient<any>;
}

export type Actions = {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const actionDefs = {
  setUser: (user: User) => (state: State) => ({
    ...state,
    user
  }),
  setLoading: (loading: boolean) => (state: State) => ({
    ...state,
    loading
  }),
  signIn: () => (_: State) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  },
  signOut: () => async (
    _: State,
    actions: Actions,
    { apolloClient }: Context
  ) => {
    actions.setLoading(true);
    try {
      await firebase.auth().signOut();
      apolloClient.resetStore();
      await apolloClient.mutate({
        mutation: LOGOUT
      });
    } catch (error) {
      console.log(error);
      console.error("Faild to sign out");
    } finally {
      actions.setUser(null);
      actions.setLoading(false);
    }
  }
};
