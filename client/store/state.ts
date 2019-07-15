export type User = string | null;

export interface State {
  user: User;
  loading: boolean;
}

export const defaultState: State = {
  user: null,
  loading: false
};
