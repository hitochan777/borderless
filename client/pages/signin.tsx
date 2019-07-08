import React from "react";

import { useStateValue } from "../store";
import Layout from "../layout/default";

export default () => {
  const { actions } = useStateValue();
  return (
    <Layout>
      <button onClick={() => actions.signIn()}>Sign in with Google</button>
    </Layout>
  );
};
