
import { useState } from "react";

export type Actions<S, A extends ActionDefs<S>> = {
  [K in keyof A]: (...args: Parameters<A[K]>) => void
};

export type MaybeStateReturner<T> = (state: T) => T | void;

export interface ActionDefs<T> {
  [key: string]: (...args: any[]) => MaybeStateReturner<T>;
}

export const useActionState = <S, A extends ActionDefs<S>>(
  initialState: S,
  actionDefs: A
): {state: S, actions: Actions<S, A>} => {
  const [state, setState] = useState(initialState);
  let actions = {} as Actions<S, A>;
  for (const name in actionDefs) {
    const action = actionDefs[name];
    actions[name] = (...args) => {
      const result = action(...args)(state);
      if (result !== undefined) {
        setState(result);
      }
    };
  }

  return {
    state,
    actions
  };
};
