import React, { useState, useMemo } from "react";
import Router from "next/router";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Comment as CommentIcon, Close as CloseIcon } from "@material-ui/icons";
import {
  Badge,
  Box,
  Chip,
  Typography,
  Grid,
  Button,
  Paper,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import Link from "next/link";

import { useTranslation } from "@/i18n";
import {
  FETCH_TWEETS_FOR_LINE_QUERY,
  FETCH_POST_BY_ID_QUERY,
} from "@/constant/graphql";
import dayjs from "@/lib/time";
import { useTweetCreateMutation, usePostLikeMutation } from "@/generated/types";
import { LineCommentList } from "@/components/organism";
import { CommentForm, LikeIcon } from "@/components/molecule";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
  },
  paperFooter: {
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "flex-end",
  },
  metaData: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: 30,
    height: 30,
  },
  button: {
    height: theme.spacing(3),
    padding: 0,
  },
  focusedLine: {
    backgroundColor: "#eee",
  },
  hoveredLine: {
    backgroundColor: "#eee",
  },
  commentAppBar: {
    textAlign: "center",
  },
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
  likedByMe,
}) => {
  const { t } = useTranslation("common");
  const classes = useStyles();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const theme = useTheme();
  const isLargerThanSm = useMediaQuery(theme.breakpoints.up("sm"));
  const focusedLine = useMemo(() => {
    const currentLines = lines.filter((line) => line.id === focusedLineId);
    if (currentLines.length === 0) {
      return null;
    }
    return currentLines[0];
  }, [focusedLineId]);

  const [postLike, postLikeResult] = usePostLikeMutation({
    optimisticResponse: {
      __typename: "Mutation",
      postLike: {
        __typename: "Post",
        id: id,
        likeCount: likedByMe ? likeCount - 1 : likeCount + 1,
        likedByMe: true,
      },
    },
  });

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
    const corrections = [...comment.matchAll(/```(.*?)```/gs)];
    if (corrections.length > 1) {
      alert("You cannot post multiple corrections at once");
      return;
    }
    const commentWithoutCorrection = comment
      .replace(/```(.*?)```/gs, "")
      .trim();

    await createTweet({
      variables: {
        tweet: {
          postId: id,
          text: commentWithoutCorrection,
          correction:
            corrections.length === 1 ? corrections[0][1].trim() : null,
          inReplyTo: focusedLineId,
        },
      },
      refetchQueries: [
        {
          query: FETCH_TWEETS_FOR_LINE_QUERY,
          variables: { id: focusedLineId },
        },
        {
          query: FETCH_POST_BY_ID_QUERY,
          variables: { id },
        },
      ],
    });
    setComment("");
  };

  const handleLineHover = (lineId: string) => {
    setHoveredLine(lineId);
  };

  const handleLanguageClick = (language: string) => {
    Router.push(`/search?lang=${language}`);
  };

  const commentSection = (
    <>
      <CommentForm
        onSubmit={postTweet}
        disabled={createTweetResult.loading}
        onChange={handleCommentFormChange}
        value={comment}
        line={focusedLine ? focusedLine.text : ""}
      />
      {focusedLineId !== null && (
        <LineCommentList
          lineId={focusedLineId}
          line={focusedLine ? focusedLine.text : ""}
        />
      )}
    </>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <Paper className={classes.paper} elevation={0}>
          <Typography gutterBottom variant="h1" align="center">
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
              <Typography variant="subtitle1">
                <Link href="/[username]" as={`/${user.username}`}>
                  <a>{user.username}</a>
                </Link>
                ・{dayjs(updatedAt).fromNow()}
              </Typography>
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
            <Grid item></Grid>
            <Grid item>
              {isDraft && (
                <Link
                  href="/[username]/[postId]/edit"
                  as={`/${user.username}/${id}/edit`}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    {t("edit")}
                  </Button>
                </Link>
              )}
            </Grid>
            <Grid item>
              <IconButton
                disabled={postLikeResult.loading}
                onClick={() => handleLikeClick(id)}
              >
                <Badge color="primary" badgeContent={likeCount}>
                  <LikeIcon liked={likedByMe} />
                </Badge>
              </IconButton>
            </Grid>
          </Grid>

          <div>
            {lines
              .filter((line) => line.text.length > 0)
              .map((line, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: "/[username]/[postId]",
                    query: { lid: line.id },
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
                        <Badge
                          badgeContent={line.replies.length}
                          color="primary"
                        >
                          <CommentIcon />
                        </Badge>
                      )}
                    </Grid>
                  </Grid>
                </Link>
              ))}
          </div>
          <div className={classes.paperFooter}>
            <Link
              href={{
                pathname: "/[username]/[postId]/correction",
              }}
              as={`/${user.username}/${id}/correction`}
            >
              <Button color="primary" variant="contained">
                Post Correction
              </Button>
            </Link>
          </div>
        </Paper>
      </Grid>
      <Dialog
        fullScreen={!isLargerThanSm}
        fullWidth={isLargerThanSm}
        scroll="paper"
        open={focusedLineId !== null}
        onBackdropClick={() => {
          Router.push("/[username]/[postId]", `/${user.username}/${id}`);
        }}
      >
        <AppBar position="relative" className={classes.commentAppBar}>
          <Toolbar>
            <Link
              href={{
                pathname: "/[username]/[postId]",
              }}
              as={`/${user.username}/${id}`}
            >
              <IconButton edge="start" color="inherit" aria-label="close">
                <CloseIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <Box padding={3}>
          <Box marginBottom={1}>
            <Typography variant="h5">
              {focusedLine && focusedLine.text}
            </Typography>
          </Box>
          {commentSection}
        </Box>
      </Dialog>
    </Grid>
  );
};
