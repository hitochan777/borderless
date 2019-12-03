import React from "react";
import { NextPage } from "next";

import Layout from "@/layout/default";
import { Post } from "@/components/organism/Post";
import Box from "@material-ui/core/Box";

interface Props {
  id: string;
  focusedLineId: string | null;
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
  if (id === "") {
    throw new Error("post ID is not provided");
  }
  if (lineId === "") {
    throw new Error("line ID is not provided");
  }
  if (typeof id !== "string") {
    throw new Error("You might have specified multiple post IDs");
  }
  if (lineId !== undefined && typeof lineId !== "string") {
    throw new Error("You might have specified multiple post IDs");
  }
  return { id, focusedLineId: lineId === undefined ? null : lineId };
};

export default PostIndexPage;
