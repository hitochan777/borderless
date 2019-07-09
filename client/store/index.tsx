import React, { useContext } from "react";

import { useActionState } from "./useStateAction";
import { State } from "./state";
import { actionDefs, Actions } from "./action";

export const StateContext = React.createContext<{
  state: State;
  actions: Actions;
}>({
  state: {} as any,
  actions: {} as any
});

const defaultState: State = {
  currentUser: null,
  loading: true,
  tmpUser: null
};

export const StateProvider = ({
  initialState: partialInitialState = defaultState,
  children
}: {
  initialState?: Partial<State>;
  children: any;
}) => {
  const initialState = { ...defaultState, ...partialInitialState };
  const { state, actions } = useActionState<State, Actions>(
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
