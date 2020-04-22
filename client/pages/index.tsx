import React from "react";
import { NextPage } from "next";
import { Grid } from "@material-ui/core";

import Layout from "@/layout/default";
import { Feed } from "@/components/organism/Feed";

interface PageProps {
  namespacesRequired: string[];
}

const Index: NextPage<PageProps> = () => {
  return (
    <Layout>
      <Grid container justify="center">
        <Grid item sm={12}>
          <Feed />
        </Grid>
      </Grid>
    </Layout>
  );
};

Index.getInitialProps = async () => {
  return { namespacesRequired: ["common"] };
};

export default Index;
