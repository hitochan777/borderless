import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Layout from "@/layout/default";
import { GetViewerQuery, GET_VIEWER } from "@/constant/queries";
import Loading from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

const Me: React.StatelessComponent = () => {
  const { data, error, loading } = useQuery<typeof GetViewerQuery>(GET_VIEWER);

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
      <ul>
        {data.viewer.posts.map(post => (
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
    </Layout>
  );
};

export default Me;
