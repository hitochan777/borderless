import * as firebase from "firebase";

import { State, User } from "./state";

export type Actions = {
  setCurrentUser: (currentUser: User | null) => void;
  setTmpUser: (tmpUser: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const actionDefs = {
  setCurrentUser: (currentUser: User) => (state: State) => ({
    ...state,
    currentUser
  }),
  setTmpUser: (tmpUser: User) => (state: State) => ({
    ...state,
    tmpUser
  }),
  setLoading: (loading: boolean) => (state: State) => ({
    ...state,
    loading
  }),
  signIn: () => (_: State) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  },
  signOut: () => async (_: State, actions: Actions) => {
    actions.setLoading(true);
    try {
      await firebase.auth().signOut();
      actions.setCurrentUser(null);
    } catch (error) {
      console.log(error);
      console.error("Faild to sign out");
    } finally {
      actions.setLoading(false);
    }
  }
};
