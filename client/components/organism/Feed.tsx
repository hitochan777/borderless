import React from "react";
import Box from "@material-ui/core/Box";

import { PostCard } from "@/components/PostCard";
import { useFetchFeedForUserQuery } from "@/generated/types";

export const Feed: React.FC = () => {
  const { data, loading, error } = useFetchFeedForUserQuery();

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
