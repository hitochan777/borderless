import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { GET_FEED_FOR_USER, GetFeedForUser } from "../../constant/queries";
import Loading from "../../components/Loading";
import { PostCard } from "../PostCard";

interface Props {
  uid: string;
}

export const Feed: React.StatelessComponent<Props> = ({ uid }) => {
  const { data, error, loading } = useQuery<typeof GetFeedForUser>(
    GET_FEED_FOR_USER,
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
            id={+post.id}
            title={post.lines[0].text}
            username={post.user.username}
            language={post.language.name}
          />
        </li>
      ))}
    </ul>
  );
};
