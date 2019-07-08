import * as firebase from "firebase";

export type User = firebase.User | null;

export interface State {
  currentUser: User;
  loading: boolean;
  tmpUser: User;
}
