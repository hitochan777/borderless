export type User = string | null;

export interface State {
  currentUser: User;
  loading: boolean;
  tmpUser: User;
}
