import React, { useState, useMemo } from "react";
import Router from "next/router";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Comment as CommentIcon, Close as CloseIcon } from "@material-ui/icons";
import {
  Avatar,
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
  Link as MuiLink,
  useMediaQuery
} from "@material-ui/core";
import Link from "next/link";

import { useTranslation } from "@/i18n";
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
  },
  commentAppBar: {
    textAlign: "center"
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
  const { t } = useTranslation("common");
  const classes = useStyles();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const theme = useTheme();
  const isLargerThanSm = useMediaQuery(theme.breakpoints.up("sm"));
  const focusedLine = useMemo(() => {
    const currentLines = lines.filter(line => line.id === focusedLineId);
    if (currentLines.length === 0) {
      return null;
    }
    return currentLines[0];
  }, [focusedLineId]);

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

  const commentSection = (
    <>
      <CommentForm
        onSubmit={postTweet}
        disabled={createTweetResult.loading}
        onChange={handleCommentFormChange}
        value={comment}
      />
      {focusedLineId !== null && <LineCommentList lineId={focusedLineId} />}
    </>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={7}>
        <Paper className={classes.paper} elevation={isLargerThanSm ? 1 : 0}>
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
                    <MuiLink>
                      <Typography variant="subtitle1">
                        {user.username}
                      </Typography>
                    </MuiLink>
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
                    {t("edit")}
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

      {isLargerThanSm ? (
        <Grid item xs={12} sm={5}>
          {commentSection}
        </Grid>
      ) : (
        <Dialog fullScreen scroll="paper" open={focusedLineId !== null}>
          <AppBar position="relative" className={classes.commentAppBar}>
            <Toolbar>
              <Link
                href={{
                  pathname: "/[username]/[postId]"
                }}
                as={`/${user.username}/${id}`}
              >
                <IconButton edge="start" color="inherit" aria-label="close">
                  <CloseIcon />
                </IconButton>
              </Link>
            </Toolbar>
          </AppBar>
          <div>
            <Box padding={3}>
              <Typography variant="h5">
                {focusedLine && focusedLine.text}
              </Typography>
            </Box>
            {commentSection}
          </div>
        </Dialog>
      )}
    </Grid>
  );
};
