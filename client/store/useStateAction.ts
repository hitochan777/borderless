import { useState } from "react";

type MaybePromise<T> = Promise<T> | T;

export interface Actions {
  [key: string]: (...args: any[]) => MaybePromise<any>
}

export type MaybeStateReturner<S, A extends Actions> = (state: S, actions: A) => MaybePromise<S | void>;

export type ActionDefs<S, A extends Actions> = {
  [K in keyof A]: (...args: Parameters<A[K]>) => MaybeStateReturner<S, A>;
};

export const useActionState = <S, A extends Actions>(
  initialState: S,
  actionDefs: ActionDefs<S, A>
): { state: S; actions: A } => {
  const [state, setState] = useState(initialState);
  let actions = {} as A
  for (const name in actionDefs) {
    const action = actionDefs[name];
    actions[name] = (async (...args: Parameters<A[Extract<keyof A, string>]>) => {
      const result = await action(...args)(state, actions);
      if (result !== undefined) {
        setState(result);
      }
    }) as A[typeof name];
  }

  return {
    state,
    actions
  };
};