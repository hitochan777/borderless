import React from "react";
import Link from "next/link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TweetIcon from "@material-ui/icons/ChatBubble";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  commentId: number;
  username: string;
  text: string;
  createdAt: Date;
  replyCount: number;
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto"
  }
}));

export const CommentItem: React.StatelessComponent<Props> = ({
  commentId,
  username,
  text,
  createdAt,
  replyCount
}) => {
  const classes = useStyles();
  return (
    <Link href="/comment/[id]" as={`/comment/${commentId}`}>
      <Paper className={classes.paper}>
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Typography gutterBottom variant="subtitle1">
              @{username} {createdAt.toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant="body2">
              {text}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton size="small">
              <TweetIcon />
              {replyCount}
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
};
