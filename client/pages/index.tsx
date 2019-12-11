import React from "react";
import Box from "@material-ui/core/Box";

import Layout from "@/layout/default";
import { useStateValue } from "@/store";
import { Feed } from "@/components/organism/Feed";

const Index: React.StatelessComponent = () => {
  const { state } = useStateValue();
  return (
    <Layout>
      <Box paddingLeft="30%" paddingRight="30%">
        {state.user && <Feed uid={state.user} />}
      </Box>
    </Layout>
  );
};

export default Index;
