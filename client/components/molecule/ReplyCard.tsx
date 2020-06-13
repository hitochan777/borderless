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
  useSetErrorMessageMutation,
} from "@/generated/types";
import { useViewer } from "@/hooks/useViewer";

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
  correction,
  replyText,
  updatedAt,
  username,
  likeCount,
  likedByMe,
}) => {
  const [tweetLike, tweetLikeResult] = useTweetLikeMutation();
  const [tweetDelete, tweetDeleteResult] = useTweetDeleteMutation();
  const [setErrorMessage] = useSetErrorMessageMutation();
  const { viewer } = useViewer();

  const handleLikeClick = async (id: string) => {
    await tweetLike({ variables: { id } });
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this tweet?")) {
      const response = await tweetDelete({
        variables: { id },
        update(cache) {
          cache.evict({ id: `Tweet:${id}` });
        },
      });
      if (!response.data?.tweetDelete) {
        setErrorMessage({
          variables: {
            errorMessage: "Could not delete message. Please try again...",
          },
        });
      }
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
