import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import Box from "@material-ui/core/Box";
import Layout from "@/layout/default";

import { FETCH_USER_BY_USERNAME_QUERY } from "@/constant/graphql";
import {
  FetchUserByUsernameQuery,
  FetchUserByUsernameQueryVariables
} from "@/generated/types";
import Loading from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

interface Props {
  username: string;
}

const UserIndexPage: NextPage<Props> = ({ username }) => {
  const { data, error, loading } = useQuery<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >(FETCH_USER_BY_USERNAME_QUERY, { variables: { username: username } });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("learning language is not an array");
  }

  return (
    <Layout>
      <Box paddingLeft="30%" paddingRight="30%">
        {data.user.posts.map(post => (
          <Box key={post.id} mb="1rem">
            <PostCard
              id={post.id}
              title={post.title}
              username={post.user.username}
              language={post.language.name}
              updatedAt={post.updatedAt}
            />
          </Box>
        ))}
      </Box>
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
