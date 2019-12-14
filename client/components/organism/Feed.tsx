import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Box from "@material-ui/core/Box";

import { PostCard } from "@/components/PostCard";
import { FETCH_FEED_FOR_USER_QUERY } from "@/constant/graphql";
import { FetchFeedForUserQuery } from "@/generated/types";

export const Feed: React.FC = () => {
  const { data, error, loading } = useQuery<FetchFeedForUserQuery>(
    FETCH_FEED_FOR_USER_QUERY
  );

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error();
  }
  return (
    <>
      {data.feed.map(post => (
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
    </>
  );
};
