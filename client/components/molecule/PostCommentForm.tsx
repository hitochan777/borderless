import React, { useState } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";

import { useTweetCreateMutation } from "@/generated/types";

interface Props {
  postId: string;
}

const useStyles = makeStyles((theme) => ({
  commentPostButton: {
    marginTop: theme.spacing(1),
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export const PostCommentForm: React.FC<Props> = ({ postId }) => {
  const classes = useStyles();
  const [comment, setComment] = useState("");

  const [
    createPostMutation,
    createPostMutationResult,
  ] = useTweetCreateMutation();

  const postComment = async () => {
    if (comment.trim() === "") {
      alert("Comment should not be empty");
      return;
    }
    await createPostMutation({
      variables: {
        tweet: { inReplyTo: postId, postId: postId, text: comment },
      },
    });
  };

  return (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Write any comment to this post!"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <div className={classes.commentPostButton}>
        <Button
          color="primary"
          variant="contained"
          disabled={createPostMutationResult.loading}
          onClick={postComment}
        >
          Post Comment
        </Button>
      </div>
    </div>
  );
};
