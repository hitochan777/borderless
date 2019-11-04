import React from "react";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {}
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
      <ListItem>
        <ListItemText
          primary={
            <>
              <span>{`@${username} ${createdAt.toLocaleDateString()}`}</span>{" "}
              <IconButton size="small">
                <TweetIcon />
                {replyCount}
              </IconButton>
            </>
          }
          secondary={
            <>
              <Typography
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {text}
              </Typography>
            </>
          }
        />
      </ListItem>
    </Link>
  );
};
