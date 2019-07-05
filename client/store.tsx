import React, { useContext } from "react";

import { Actions, useActionState } from "./useStateAction";

type User = any;

interface State {
  currentUser: User;
  loading: boolean;
  tmpUser: User;
}

const actionDefs = {
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
  })
};

export const StateContext = React.createContext<{
  state: State;
  actions: Actions<State, typeof actionDefs>;
}>({
  state: {} as any,
  actions: {} as any
});

const defaultState: State = {
  currentUser: true,
  loading: true,
  tmpUser: true
}

export const StateProvider = ({
  initialState = defaultState,
  children
}: {
  initialState?: State;
  children: any;
}) => {
  const { state, actions } = useActionState<State, typeof actionDefs>(
    initialState,
    actionDefs
  );

  return (
    <StateContext.Provider value={{ state, actions }}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
