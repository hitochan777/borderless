import React from "react";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/react-hooks";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import { GET_POST_BY_ID, GetPostById } from "@/constant/queries";
import Loading from "@/components/Loading";
import {
  PostContent,
  Props as PostContentProps
} from "@/components/organism/PostContent";
import { CommentItem } from "@/components/molecule/CommentItem";

interface PresenterProps extends PostContentProps {
  lineNum?: number;
  handleClose: () => void;
}

export const PostPresenter: React.StatelessComponent<PresenterProps> = ({
  id,
  lineNum,
  isDraft,
  lines,
  language,
  user,
  handleClose
}) => {
  const shouldDisplayTwoColumns =
    lineNum !== undefined && lines[lineNum].replies.length > 0;
  const contentColumns = shouldDisplayTwoColumns ? 6 : 12;
  return (
    <Grid container spacing={2}>
      <Grid item xs={contentColumns}>
        <PostContent
          id={+id}
          isDraft={isDraft}
          lines={lines}
          language={language}
          user={user}
        />
      </Grid>
      {shouldDisplayTwoColumns && (
        <>
          <Grid item xs={6}>
            <Grid container justify="flex-end">
              <Grid item>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            {lines[lineNum as number].replies.map((reply, index) => (
              <div key={index}>
                <CommentItem
                  commentId={index}
                  username={"TODO"}
                  text={reply.text}
                  createdAt={new Date(Date.now())}
                  replyCount={2}
                />
                <Divider />
              </div>
            ))}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export interface Props {
  id: number;
  lineNum?: number;
}

export const Post: React.StatelessComponent<Props> = ({ id, lineNum }) => {
  const router = useRouter();
  const { data, error, loading } = useQuery<typeof GetPostById>(
    GET_POST_BY_ID,
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
  return (
    <PostPresenter
      id={+data.post.id}
      isDraft={data.post.isDraft}
      lines={data.post.lines}
      language={data.post.language}
      user={data.post.user}
      handleClose={() => {
        router.push("/post/[id]", `/post/${id}`);
      }}
      lineNum={lineNum}
    />
  );
};
