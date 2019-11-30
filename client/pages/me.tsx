import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Box from "@material-ui/core/Box";

import Layout from "@/layout/default";
import { FETCH_VIEWER_QUERY } from "@/constant/graphql";
import { FetchViewerQuery } from "@/generated/types";
import Loading from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

const Me: React.StatelessComponent = () => {
  const { data, error, loading } = useQuery<FetchViewerQuery>(
    FETCH_VIEWER_QUERY
  );

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
        {data.viewer.posts.map(post => (
          <Box mb="1rem">
            <PostCard
              id={+post.id}
              title={post.title}
              username={post.user.username}
              language={post.language.name}
            />
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

export default Me;
