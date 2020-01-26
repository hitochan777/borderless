import React from "react";
import { Grid } from "@material-ui/core";

import Layout from "@/layout/default";
import { Feed } from "@/components/organism/Feed";

const Index = () => {
  return (
    <Layout>
      <Grid container justify="center">
        <Grid item xs={12} sm={4}>
          <Feed />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Index;
