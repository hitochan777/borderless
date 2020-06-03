import React, { useState } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";

import {
  useTweetCreateMutation,
  FetchPostByIdQueryResult,
} from "@/generated/types";
import { FETCH_POST_BY_ID_QUERY } from "@/constant/graphql";

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
    createCommentMutation,
    createCommentMutationResult,
  ] = useTweetCreateMutation({
    update(cache, { data }) {
      if (!data) {
        return;
      }
      const { tweetCreate: tweet } = data;
      const currentData:
        | FetchPostByIdQueryResult["data"]
        | null = cache.readQuery({
        query: FETCH_POST_BY_ID_QUERY,
        variables: { id: postId },
      });
      if (!currentData) {
        return;
      }
      console.log(currentData, tweet);
      cache.writeQuery({
        query: FETCH_POST_BY_ID_QUERY,
        variables: { id: postId },
        data: {
          ...currentData,
          post: {
            ...currentData.post,
            replies: [tweet, ...currentData.post.replies],
          },
        },
      });
    },
  });

  const postComment = async () => {
    if (comment.trim() === "") {
      alert("Comment should not be empty");
      return;
    }
    await createCommentMutation({
      variables: {
        tweet: { inReplyTo: postId, postId: postId, text: comment },
      },
    });
    setComment("");
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
          disabled={createCommentMutationResult.loading}
          onClick={postComment}
        >
          Post Comment
        </Button>
      </div>
    </div>
  );
};
