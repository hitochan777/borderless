import React from "react";
import { NextPage } from "next";

import Layout from "@/layout/default";
import { Post } from "@/components/organism/Post";
import { Grid } from "@material-ui/core";

interface Props {
  id: string;
  focusedLineId: string | null;
}

const PostIndexPage: NextPage<Props> = ({ id, focusedLineId }) => {
  return (
    <Layout>
      <Grid container justify="center">
        <Grid item xs={12} sm={4}>
          <Post id={id} focusedLineId={focusedLineId} />
        </Grid>
      </Grid>
    </Layout>
  );
};

PostIndexPage.getInitialProps = async ctx => {
  const { query } = ctx;
  const { postId, lid: lineId } = query;
  if (postId === "") {
    throw new Error("post ID is not provided");
  }
  if (lineId === "") {
    throw new Error("line ID is not provided");
  }
  if (typeof postId !== "string") {
    throw new Error("You might have specified multiple post IDs");
  }
  if (lineId !== undefined && typeof lineId !== "string") {
    throw new Error("You might have specified multiple post IDs");
  }
  return { id: postId, focusedLineId: lineId === undefined ? null : lineId };
};

export default PostIndexPage;
