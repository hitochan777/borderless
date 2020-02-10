import React from "react";
import { NextPage } from "next";
import { Box, Grid } from "@material-ui/core";
import Layout from "@/layout/default";

import { useFetchUserByUsernameQuery } from "@/generated/types";
import { PostCard } from "@/components/PostCard";

interface Props {
  username: string;
}

const UserIndexPage: NextPage<Props> = ({ username }) => {
  const { data, error, loading } = useFetchUserByUsernameQuery({
    variables: { username }
  });

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("learning language is not an array");
  }

  return (
    <Layout>
      <Grid container justify="center">
        <Grid item xs={12} sm={4}>
          {data.user.posts.map(post => (
            <Box key={post.id} mb="1rem">
              <PostCard
                id={post.id}
                title={post.title}
                username={post.user.username}
                language={post.language.name}
                updatedAt={post.updatedAt}
                description={post.lines
                  .map(line => line.partialLines.map(pl => pl.text).join(""))
                  .join("")}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

UserIndexPage.getInitialProps = async ctx => {
  const { query } = ctx;
  const { username } = query;
  if (username === "") {
    throw new Error("username is empty");
  }
  if (typeof username !== "string") {
    throw new Error("username should be string");
  }
  return { username };
};

export default UserIndexPage;
