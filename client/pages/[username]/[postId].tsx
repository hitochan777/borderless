import React from "react";
import { NextPage, GetServerSideProps } from "next";
import { Grid } from "@material-ui/core";

import Layout from "@/layout/default";
import { Post } from "@/components/organism/Post";

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  return {
    props: { id: postId, focusedLineId: lineId === undefined ? null : lineId },
  };
};

export default PostIndexPage;
