import React from "react";

import { useStateValue } from "../store";

export default () => {
  const { state, actions } = useStateValue();
  return (
    <>
      <div>{state.currentUser ? "Logged in" : "NOT logged in"}</div>
      <button onClick={() => actions.setCurrentUser(!state.currentUser)}>
        {state.currentUser ? "logout" : "login"}
      </button>
    </>
  );
};
