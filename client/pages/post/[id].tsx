import React from "react";
import { NextPage } from "next";

import Layout from "@/layout/default";
import { Post } from "@/components/organism/Post";
import Box from "@material-ui/core/Box";

interface Props {
  id: number;
  focusedLineId: number | null;
}

const PostIndexPage: NextPage<Props> = ({ id, focusedLineId }) => {
  return (
    <Layout>
      <Box paddingLeft="20%" paddingRight="20%">
        <Post id={id} focusedLineId={focusedLineId} />
      </Box>
    </Layout>
  );
};

PostIndexPage.getInitialProps = async ctx => {
  const { query } = ctx;
  const { id, lid: lineId } = query;
  if (typeof id !== "string") {
    throw new Error("unexpected type in id");
  }
  if (lineId && typeof lineId !== "string") {
    throw new Error("unexpected type in line");
  }
  const lineNumber = isNaN(+lineId) ? null : +lineId;
  return { id: +id, focusedLineId: lineNumber };
};

export default PostIndexPage;
