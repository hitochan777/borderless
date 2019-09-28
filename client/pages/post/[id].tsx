import React from "react";
import Link from "next/link";
import { NextPage } from "next";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/react-hooks";
import Badge from "@material-ui/core/Badge";
import TweetIcon from "@material-ui/icons/ChatBubble";

import { GET_POST_BY_ID, GetPostById } from "@/constant/queries";
import Layout from "@/layout/default";
import Loading from "@/components/Loading";

interface Props {
  id: number;
}

const useStyles = makeStyles(theme => ({
  margin: {
    marginRight: theme.spacing(2)
  },
  padding: {
    padding: theme.spacing(0, 2)
  }
}));

const PostIndexPage: NextPage<Props> = ({ id }) => {
  const classes = useStyles();

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
          <h3>{data.post.lines[0].text}</h3>
          <ul>
            <li>Language: {data.post.language.name}</li>
            <li>Posted by {data.post.user.username}</li>
            <li>
              Content
              <div>
                {data.post.lines.map((line, index) => (
                  <p key={index}>
                    <Badge
                      className={classes.margin}
                      badgeContent={line.replies.length}
                      color="primary"
                    >
                      <TweetIcon />
                    </Badge>
                    {line.text}
                  </p>
                ))}
              </div>
            </li>
          </ul>
          {data.post.isDraft ? (
            <Link href="/post/[id]/edit" as={`/post/${data.post.id}/edit`}>
              <Button variant="contained" color="primary">
                Edit
              </Button>
            </Link>
          ) : (
            <Button variant="contained" color="primary" disabled={true}>
              Published
            </Button>
          )}
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
