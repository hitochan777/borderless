import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { FETCH_POST_BY_ID_QUERY } from "@/constant/graphql";
import { FetchPostByIdQuery } from "@/generated/types";
import Loading from "@/components/Loading";
import {
  PostContent,
  Props as PostContentProps
} from "@/components/organism/PostContent";

interface PresenterProps extends PostContentProps {}

export const PostPresenter: React.StatelessComponent<PresenterProps> = ({
  id,
  isDraft,
  lines,
  language,
  user
}) => {
  return (
    <PostContent
      id={+id}
      isDraft={isDraft}
      lines={lines}
      language={language}
      user={user}
    />
  );
};

export interface Props {
  id: number;
}

export const Post: React.StatelessComponent<Props> = ({ id }) => {
  const { data, error, loading } = useQuery<FetchPostByIdQuery>(
    FETCH_POST_BY_ID_QUERY,
    {
      variables: { id }
    }
  );

  if (loading) {
    return <Loading />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("data is empty");
  }
  console.log(data.post);
  return (
    <PostPresenter
      id={+data.post.id}
      isDraft={data.post.isDraft}
      lines={data.post.lines.map(line => line.partialLines[0].text)}
      language={data.post.language}
      user={data.post.user}
    />
  );
};
