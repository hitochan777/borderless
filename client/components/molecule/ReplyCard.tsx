import React from "react";
import Link from "next/link";
import { Badge, IconButton } from "@material-ui/core";
import dayjs from "dayjs";
import { Delete as DeleteIcon } from "@material-ui/icons";

import { LikeIcon } from "@/components/molecule";
import { PrettyReply } from "./PrettyReply";
import {
  useTweetLikeMutation,
  useTweetDeleteMutation,
} from "@/generated/types";
import { useViewer } from "@/hooks/useViewer";
import { FETCH_TWEETS_FOR_LINE_QUERY } from "@/constant/graphql";

interface Props {
  tweetId: string;
  line?: string;
  inReplyTo?: string | null;
  correction?: string;
  replyText: string;
  updatedAt: Date;
  username: string;
  likeCount: number;
  likedByMe: boolean;
}

export const ReplyCard: React.FC<Props> = ({
  tweetId,
  line,
  inReplyTo,
  correction,
  replyText,
  updatedAt,
  username,
  likeCount,
  likedByMe,
}) => {
  const [tweetLike, tweetLikeResult] = useTweetLikeMutation();
  const [tweetDelete, tweetDeleteResult] = useTweetDeleteMutation();
  const { viewer } = useViewer();

  const handleLikeClick = async (id: string) => {
    await tweetLike({ variables: { id } });
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this tweet?")) {
      const refetchQueries = [];
      if (inReplyTo) {
        refetchQueries.push({
          query: FETCH_TWEETS_FOR_LINE_QUERY,
          variables: { id: inReplyTo },
        });
      }
      await tweetDelete({
        variables: { id },
        refetchQueries,
      });
    }
  };
  return (
    <div>
      <Link href="/[username]" as={`/${username}`}>
        <a>{username}</a>
      </Link>
      ・{dayjs(updatedAt).fromNow()}
      {viewer && (
        <IconButton
          disabled={tweetLikeResult.loading}
          onClick={() => handleLikeClick(tweetId)}
        >
          <Badge color="primary" badgeContent={likeCount}>
            {" "}
            <LikeIcon liked={likedByMe} />
          </Badge>
        </IconButton>
      )}
      {viewer && viewer.username === username && (
        <IconButton
          disabled={tweetDeleteResult.loading}
          onClick={() => handleDeleteClick(tweetId)}
        >
          <DeleteIcon />
        </IconButton>
      )}
      <PrettyReply line={line} correction={correction} reply={replyText} />
    </div>
  );
};
