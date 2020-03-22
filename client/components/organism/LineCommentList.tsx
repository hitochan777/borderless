import React from "react";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  IconButton,
  makeStyles,
  Link as MuiLink,
} from "@material-ui/core";

import dayjs from "@/lib/time";
import { LikeIcon } from "@/components/molecule/LikeIcon";
import {
  useTweetLikeMutation,
  useFetchTweetsForLineQuery,
} from "@/generated/types";
import { PrettyReply } from "@/components/molecule/PrettyReply";

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
  const [tweetLike] = useTweetLikeMutation();

  const handleLikeClick = async (id: string) => {
    await tweetLike({ variables: { id } });
  };

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
              <div>
                <Avatar
                  className={classes.avatar}
                  alt={reply.postedBy.username}
                  src={`https://api.adorable.io/avatars/30/${reply.postedBy.username}@borderless.png`}
                />
                <Link href="/[username]" as={`/${reply.postedBy.username}`}>
                  <MuiLink>{reply.postedBy.username}</MuiLink>
                </Link>{" "}
                {dayjs(reply.updatedAt).fromNow()}
                <IconButton onClick={() => handleLikeClick(reply.id)}>
                  <Badge color="primary" badgeContent={reply.likeCount}>
                    {" "}
                    <LikeIcon liked={reply.likedByMe} />
                  </Badge>
                </IconButton>
              </div>
              <div>
                <PrettyReply
                  line={line}
                  correction={reply.correction || undefined}
                  reply={reply.text}
                />
              </div>
            </ListItemText>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};
