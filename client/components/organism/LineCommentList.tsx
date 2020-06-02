import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  makeStyles,
} from "@material-ui/core";

import { ReplyCard } from "@/components/molecule";
import { useFetchTweetsForLineQuery } from "@/generated/types";

interface Props {
  lineId: string;
  line: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  avatar: {
    width: "30px",
    height: "auto",
    display: "inline-block",
  },
}));

export const LineCommentList: React.FC<Props> = ({ lineId, line }) => {
  const classes = useStyles();
  const { data, error, loading } = useFetchTweetsForLineQuery({
    variables: { id: lineId },
  });

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("unexpected error");
  }
  return (
    <List className={classes.root}>
      {data.replies.map((reply) => (
        <React.Fragment key={reply.id}>
          <ListItem>
            <ListItemText>
              <ReplyCard
                tweetId={reply.id}
                line={line}
                correction={reply.correction || undefined}
                replyText={reply.text}
                likeCount={reply.likeCount}
                likedByMe={reply.likedByMe}
                updatedAt={reply.updatedAt}
                username={reply.postedBy.username}
              />
            </ListItemText>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};
