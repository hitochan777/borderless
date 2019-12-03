import React, { useState } from "react";
import Router from "next/router";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import CommentIcon from "@material-ui/icons/Comment";
import Badge from "@material-ui/core/Badge";
import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";

import {
  TWEET_CREATE_MUTATION,
  FETCH_TWEETS_FOR_LINE_QUERY,
  FETCH_POST_BY_ID_QUERY
} from "@/constant/graphql";
import {
  TweetCreateMutation,
  TweetCreateMutationVariables
} from "@/generated/types";
import { LineCommentList } from "@/components/organism/LineCommentList";
import { CommentForm } from "@/components/molecule/CommentForm";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4),
    margin: "auto"
  },
  metaData: {
    marginBottom: theme.spacing(2)
  },
  avatar: {
    width: 30,
    height: 30
  },
  button: {
    height: theme.spacing(3),
    padding: 0
  },
  focusedLine: {
    backgroundColor: "#eee"
  },
  hoveredLine: {
    backgroundColor: "#eee"
  }
}));

export interface Props {
  id: string;
  focusedLineId: string | null;
  user: {
    username: string;
  };
  lines: {
    id: string;
    text: string;
    replies: { id: string; text: string }[];
  }[];
  language: {
    name: string;
  };
  isDraft: boolean;
}

const useCreateTweet = () => {
  const [createTweet, { loading, error }] = useMutation<
    TweetCreateMutation,
    TweetCreateMutationVariables
  >(TWEET_CREATE_MUTATION);
  return { createTweet, loading, error };
};

export const PostContent: React.FC<Props> = ({
  id,
  focusedLineId,
  user,
  lines,
  language,
  isDraft
}) => {
  const classes = useStyles();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const { createTweet, loading: createTweetLoading } = useCreateTweet();

  const handleCommentFormChange = (newComment: string) => {
    setComment(newComment);
  };

  const postTweet = async () => {
    if (focusedLineId === null) {
      alert("you need to focus on some line");
      return;
    }
    await createTweet({
      variables: {
        tweet: {
          postId: id,
          text: comment,
          inReplyTo: focusedLineId
        }
      },
      refetchQueries: [
        {
          query: FETCH_TWEETS_FOR_LINE_QUERY,
          variables: { id: focusedLineId }
        },
        {
          query: FETCH_POST_BY_ID_QUERY,
          variables: { id }
        }
      ]
    });
  };

  const handleLineHover = (lineId: string) => {
    setHoveredLine(lineId);
  };

  const handleLineClick = (lineId: string) => {
    Router.push(
      { pathname: `/post/[id]`, query: { lid: lineId } },
      `/post/${id}?lid=${lineId}`
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant="h2" align="center">
            {lines[0].text}
          </Typography>
          <Grid
            container
            direction="row"
            spacing={1}
            className={classes.metaData}
            justify="center"
          >
            <Grid item>
              <Avatar
                alt={user.username}
                src={`https://api.adorable.io/avatars/30/${user.username}@borderless.png`}
                className={classes.avatar}
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{user.username}</Typography>
            </Grid>
            <Grid item>
              <Chip label={language.name} size="small" />
            </Grid>
            <Grid item>
              {isDraft ? (
                <Link href="/post/[id]/edit" as={`/post/${id}/edit`}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Edit
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={true}
                  className={classes.button}
                >
                  Published
                </Button>
              )}
            </Grid>
          </Grid>

          <div>
            {lines.map((line, index) => (
              <Grid
                key={index}
                container
                spacing={2}
                justify="space-between"
                className={
                  (line.id === focusedLineId ? classes.focusedLine : "") +
                  " " +
                  (line.id === hoveredLine ? classes.hoveredLine : "")
                }
                onClick={() => {
                  handleLineClick(line.id);
                }}
                onMouseOver={() => {
                  handleLineHover(line.id);
                }}
              >
                <Grid item>
                  <Typography key={index} variant="body1" component="p">
                    {line.text}
                  </Typography>
                </Grid>
                <Grid item>
                  {line.replies.length > 0 && (
                    <Badge badgeContent={line.replies.length} color="primary">
                      <CommentIcon />
                    </Badge>
                  )}
                </Grid>
              </Grid>
            ))}
          </div>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <CommentForm
          onSubmit={postTweet}
          disabled={createTweetLoading}
          onChange={handleCommentFormChange}
          value={comment}
        />
        {focusedLineId !== null && <LineCommentList lineId={focusedLineId} />}
      </Grid>
    </Grid>
  );
};
