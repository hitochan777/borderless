import React from "react";
import styled from "styled-components";

import { useFetchPostByIdQuery } from "@/generated/types";
import { PostContent } from "@/components/organism";
import { PostCorrections } from "@/components/molecule";
import { TextField, Button, makeStyles } from "@material-ui/core";

const Container = styled.div``;

export interface Props {
  id: string;
  focusedLineId: string | null;
}

const useStyles = makeStyles((theme) => ({
  commentPostButton: {
    marginTop: theme.spacing(1),
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export const Post: React.FC<Props> = ({ id, focusedLineId }) => {
  const classes = useStyles();
  const { data, error, loading } = useFetchPostByIdQuery({ variables: { id } });

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("data is empty");
  }
  const lines = data.post.lines.map((line) => ({
    id: line.id,
    text: line.partialLines[0].text,
    replies: line.replies.map(({ id, text }) => ({ id, text })),
  }));

  return (
    <Container>
      <PostContent
        id={data.post.id}
        focusedLineId={focusedLineId}
        isDraft={data.post.isDraft}
        lines={lines}
        language={data.post.language}
        user={data.post.user}
        updatedAt={new Date(data.post.updatedAt)}
        likedByMe={data.post.likedByMe}
        likeCount={data.post.likeCount}
      />
      <PostCorrections corrections={data.post.corrections} lines={lines} />
      <div>
        {data.post.replies.map((reply) => (
          <div>{reply.text}</div>
        ))}
      </div>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Write any comment to this post!"
      />
      <div className={classes.commentPostButton}>
        <Button color="primary" variant="contained">
          Post Comment
        </Button>
      </div>
    </Container>
  );
};
