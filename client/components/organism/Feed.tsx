import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Loading from "@/components/Loading";
import { PostCard } from "@/components/PostCard";
import { FETCH_FEED_FOR_USER_QUERY } from "@/constant/graphql";
import { FetchFeedForUserQuery } from "@/generated/types";

interface Props {
  uid: string;
}

export const Feed: React.StatelessComponent<Props> = ({ uid }) => {
  const { data, error, loading } = useQuery<FetchFeedForUserQuery>(
    FETCH_FEED_FOR_USER_QUERY,
    {
      variables: { uid }
    }
  );

  if (loading) {
    return <Loading />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error();
  }
  return (
    <ul>
      {data.feed.map(post => (
        <li key={post.id}>
          <PostCard
            id={post.id}
            title={post.title}
            username={post.user.username}
            language={post.language.name}
          />
        </li>
      ))}
    </ul>
  );
};
