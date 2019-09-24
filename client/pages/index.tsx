import React from "react";

import Layout from "@/layout/default";
import { useStateValue } from "@/store";
import { Feed } from "@/components/organism/Feed";

const Index: React.StatelessComponent = () => {
  const { state } = useStateValue();
  return <Layout>{state.user && <Feed uid={state.user} />}</Layout>;
};

export default Index;
