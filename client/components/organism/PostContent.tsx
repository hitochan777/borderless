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
import IconButton from "@material-ui/core/IconButton";
import {
  FETCH_TWEETS_FOR_LINE_QUERY,
  FETCH_POST_BY_ID_QUERY
} from "@/constant/graphql";

import dayjs from "@/lib/time";
import { LikeIcon } from "@/components/molecule/LikeIcon";
import { useTweetCreateMutation, usePostLikeMutation } from "@/generated/types";
import { LineCommentList } from "@/components/organism/LineCommentList";
import { CommentForm } from "@/components/molecule/CommentForm";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    minHeight: "80vh"
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
    id: string;
    name: string;
  };
  isDraft: boolean;
  updatedAt: Date;
  likedByMe: boolean;
  likeCount: number;
}

export const PostContent: React.FC<Props> = ({
  id,
  focusedLineId,
  user,
  lines,
  language,
  isDraft,
  updatedAt,
  likeCount,
  likedByMe
}) => {
  const classes = useStyles();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const [postLike] = usePostLikeMutation();

  const handleLikeClick = async (id: string) => {
    await postLike({ variables: { id } });
  };
  const [createTweet, createTweetResult] = useTweetCreateMutation();

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
    setComment("");
  };

  const handleLineHover = (lineId: string) => {
    setHoveredLine(lineId);
  };

  const handleLanguageClick = (language: string) => {
    Router.push(`/search?lang=${language}`);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={7}>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant="h4" align="center">
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
              <Link href="/[username]" as={`/${user.username}`}>
                <Grid container spacing={1}>
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
                </Grid>
              </Link>
            </Grid>
            <Grid item>
              <Chip
                label={language.name}
                size="small"
                onClick={() => {
                  handleLanguageClick(language.id);
                }}
              />
            </Grid>
            <Grid item>{dayjs(updatedAt).fromNow()}</Grid>
            <Grid item>
              {isDraft ? (
                <Link
                  href="/[username]/[postId]/edit"
                  as={`/${user.username}/${id}/edit`}
                >
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
            <Grid item>
              <IconButton onClick={() => handleLikeClick(id)}>
                <Badge color="primary" badgeContent={likeCount}>
                  <LikeIcon liked={likedByMe} />
                </Badge>
              </IconButton>
            </Grid>
          </Grid>

          <div>
            {lines.map((line, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/[username]/[postId]",
                  query: { lid: line.id }
                }}
                as={`/${user.username}/${id}?lid=${line.id}`}
              >
                <Grid
                  container
                  spacing={2}
                  justify="space-between"
                  className={
                    (line.id === focusedLineId ? classes.focusedLine : "") +
                    " " +
                    (line.id === hoveredLine ? classes.hoveredLine : "")
                  }
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
              </Link>
            ))}
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={5}>
        <CommentForm
          onSubmit={postTweet}
          disabled={createTweetResult.loading}
          onChange={handleCommentFormChange}
          value={comment}
        />
        {focusedLineId !== null && <LineCommentList lineId={focusedLineId} />}
      </Grid>
    </Grid>
  );
};
