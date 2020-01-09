import React from "react";

import { useFetchPostByIdQuery } from "@/generated/types";
import {
  PostContent,
  Props as PostContentProps
} from "@/components/organism/PostContent";

type PresenterProps = PostContentProps;

export const PostPresenter: React.FC<PresenterProps> = ({
  id,
  focusedLineId,
  isDraft,
  lines,
  language,
  user,
  updatedAt,
  likeCount,
  likedByMe
}) => {
  return (
    <PostContent
      id={id}
      focusedLineId={focusedLineId}
      isDraft={isDraft}
      lines={lines}
      language={language}
      user={user}
      updatedAt={updatedAt}
      likeCount={likeCount}
      likedByMe={likedByMe}
    />
  );
};

export interface Props {
  id: string;
  focusedLineId: string | null;
}

export const Post: React.FC<Props> = ({ id, focusedLineId }) => {
  const { data, error, loading } = useFetchPostByIdQuery({ variables: { id } });

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("data is empty");
  }
  return (
    <PostPresenter
      id={data.post.id}
      focusedLineId={focusedLineId}
      isDraft={data.post.isDraft}
      lines={data.post.lines.map(line => ({
        id: line.id,
        text: line.partialLines[0].text,
        replies: line.replies.map(({ id, text }) => ({ id, text }))
      }))}
      language={data.post.language}
      user={data.post.user}
      updatedAt={new Date(data.post.updatedAt)}
      likedByMe={data.post.likedByMe}
      likeCount={data.post.likeCount}
    />
  );
};
