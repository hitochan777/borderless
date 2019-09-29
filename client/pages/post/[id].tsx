import React from "react";
import { NextPage } from "next";
import Container from "@material-ui/core/Container";
import { useQuery } from "@apollo/react-hooks";

import { GET_POST_BY_ID, GetPostById } from "@/constant/queries";
import Layout from "@/layout/default";
import Loading from "@/components/Loading";
import { PostContent } from "@/components/organism/PostContent";

interface Props {
  id: number;
}

const PostIndexPage: NextPage<Props> = ({ id }) => {
  const { data, error, loading } = useQuery<typeof GetPostById>(
    GET_POST_BY_ID,
    {
      variables: { id }
    }
  );

  if (loading) {
    return <Loading />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("data is empty");
  }

  return (
    <Layout>
      <Container maxWidth="sm">
        <PostContent
          id={+data.post.id}
          isDraft={data.post.isDraft}
          lines={data.post.lines}
          language={data.post.language}
          user={data.post.user}
        />
      </Container>
    </Layout>
  );
};

PostIndexPage.getInitialProps = async ({ query }) => {
  const { id } = query;
  if (typeof id !== "string") {
    throw new Error("unexpected type in id");
  }
  return { id: +id as number };
};

export default PostIndexPage;
