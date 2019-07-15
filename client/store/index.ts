import { createBundle } from "react-state-action-hooks";
import { State } from "./state";
import { Actions } from "./action";

export { defaultState } from "./state";
export { actionDefs } from "./action";

const { StateProvider, useStateValue } = createBundle<State, Actions>();
export { StateProvider, useStateValue };
