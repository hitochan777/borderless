import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Layout from "../layout/default";
import { GET_VIEWER, GetViewerQuery } from "../constant/queries";
import Loading from "../components/Loading";
import { PostCard } from "../components/PostCard";

export default () => {
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
          <li>
            <PostCard
              title={post.text}
              username="hoge"
              language="English"
              handleClick={() => {
                alert("clicked");
              }}
            />
          </li>
        ))}
      </ul>
    </Layout>
  );
};
