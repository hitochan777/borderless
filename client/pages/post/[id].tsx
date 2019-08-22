import React from "react";
import { NextPage } from "next";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { useQuery } from "@apollo/react-hooks";

import { GET_POST_BY_ID, GetPostById } from "../../constant/queries";
import Layout from "../../layout/default";
import Loading from "../../components/Loading";

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
        <Paper>
          <h3>title here</h3>
          <ul>
            <li>{data.post.language.name}</li>
            <li>{data.post.text}</li>
          </ul>
        </Paper>
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
