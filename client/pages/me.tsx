import React from "react";
import { useQuery } from "react-apollo-hooks";

import Layout from "../layout/default";
import { GET_VIEWER, GetViewerQuery } from "../constant/queries";
import Loading from "../components/Loading";

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
          <li>{post.text}</li>
        ))}
      </ul>
    </Layout>
  );
};
