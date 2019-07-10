import React, { useContext } from "react";

import { useActionState } from "react-state-action-hooks";
import { State } from "./state";
import { actionDefs, Actions, Context } from "./action";

export const StateContext = React.createContext<{
  state: State;
  actions: Actions;
}>({
  state: {} as any,
  actions: {} as any
});

const defaultState: State = {
  user: null,
  loading: true
};

export const StateProvider = ({
  initialState: partialInitialState = defaultState,
  context,
  children
}: {
  initialState?: Partial<State>;
  context: Context;
  children: any;
}) => {
  const initialState = { ...defaultState, ...partialInitialState };
  const { state, actions } = useActionState<State, Actions, Context>(
    initialState,
    actionDefs,
    context
  );
  console.log(state);

  return (
    <StateContext.Provider value={{ state, actions }}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
