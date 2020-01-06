import React from "react";
import Box from "@material-ui/core/Box";

import Layout from "@/layout/default";
import { Feed } from "@/components/organism/Feed";

const Index = () => {
  return (
    <Layout>
      <Box paddingLeft="30%" paddingRight="30%">
        <Feed />
      </Box>
    </Layout>
  );
};

export default Index;
