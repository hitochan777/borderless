import React from "react";
import { NextPage } from "next";

import Layout from "@/layout/default";
import { Post } from "@/components/organism/Post";
import Box from "@material-ui/core/Box";

interface Props {
  id: number;
  line?: number;
}

const PostIndexPage: NextPage<Props> = ({ id }) => {
  return (
    <Layout>
      <Box paddingLeft="20%" paddingRight="20%">
        <Post id={id} />
      </Box>
    </Layout>
  );
};

PostIndexPage.getInitialProps = async ({ query }) => {
  const { id, line } = query;
  if (typeof id !== "string") {
    throw new Error("unexpected type in id");
  }
  if (line && typeof line !== "string") {
    throw new Error("unexpected type in line");
  }
  const lineNumber = isNaN(+line) ? undefined : +line;
  return { id: +id, line: lineNumber };
};

export default PostIndexPage;
