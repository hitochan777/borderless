import React from "react";
import styled from "styled-components";

import { useFetchPostByIdQuery } from "@/generated/types";
import { PostContent } from "@/components/organism";
import { PostCorrections, ReplyCard } from "@/components/molecule";
import { PostCommentForm } from "@/components/molecule/PostCommentForm";

const Container = styled.div``;

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
  const lines = data.post.lines.map((line) => ({
    id: line.id,
    text: line.partialLines[0].text,
    replies: line.replies.map(({ id, text }) => ({ id, text })),
  }));

  return (
    <Container>
      <PostContent
        id={data.post.id}
        focusedLineId={focusedLineId}
        isDraft={data.post.isDraft}
        lines={lines}
        language={data.post.language}
        user={data.post.user}
        updatedAt={new Date(data.post.updatedAt)}
        likedByMe={data.post.likedByMe}
        likeCount={data.post.likeCount}
      />
      <PostCorrections corrections={data.post.corrections} lines={lines} />
      <div>
        {data.post.replies.map((reply) => (
          <ReplyCard
            key={reply.id}
            tweetId={reply.id}
            replyText={reply.text}
            likeCount={reply.likeCount}
            likedByMe={reply.likedByMe}
            updatedAt={reply.updatedAt}
            username={reply.postedBy.username}
          />
        ))}
      </div>
      <PostCommentForm postId={id} />
    </Container>
  );
};
