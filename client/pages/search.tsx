import React from "react";
import { NextPage } from "next";

import Layout from "@/layout/default";
import Box from "@material-ui/core/Box";

interface Props {
  language: string | string[] | undefined;
}

const SearchPage: NextPage<Props> = ({ language }) => {
  return (
    <Layout>
      <Box paddingLeft="20%" paddingRight="20%"></Box>
      <span>{language}</span>
    </Layout>
  );
};

SearchPage.getInitialProps = async ctx => {
  const { query } = ctx;
  const { lang } = query;
  return { language: lang };
};

export default SearchPage;
