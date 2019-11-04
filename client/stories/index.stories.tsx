import React from "react";
import { storiesOf } from "@storybook/react";

import Loading from "@/components/Loading";
import { CommentItem } from "@/components/molecule/CommentItem";
import { PostContent } from "@/components/organism/PostContent";
import { PostPresenter } from "@/components/organism/Post";

storiesOf("Loading", module).add("standard", () => <Loading />);

storiesOf("CommentItem", module).add("standard", () => (
  <CommentItem
    commentId={2}
    username="john"
    createdAt={new Date(Date.now())}
    text="this is a comment"
    replyCount={3}
  />
));

storiesOf("PostContent", module).add("standard", () => (
  <PostContent
    id={1}
    user={{ username: "john" }}
    lines={[
      {
        text: "first line",
        replies: [
          { text: "first comment for first line" },
          { text: "second comment for first line" }
        ]
      },
      {
        text: "second line",
        replies: [{ text: "first comment for second line" }]
      }
    ]}
    isDraft={false}
    language={{ name: "English" }}
  />
));

storiesOf("Post", module)
  .add("without comment", () => (
    <PostPresenter
      id={1}
      user={{ username: "john" }}
      lines={[
        {
          text: "first line",
          replies: [
            { text: "first comment for first line" },
            { text: "second comment for first line" }
          ]
        }
      ]}
      isDraft={false}
      language={{ name: "English" }}
      handleClose={() => {}}
    />
  ))
  .add("with comment", () => (
    <PostPresenter
      id={1}
      lineNum={0}
      user={{ username: "john" }}
      lines={[
        {
          text: "first line",
          replies: [
            { text: "first comment for first line" },
            { text: "second comment for first line" }
          ]
        }
      ]}
      isDraft={false}
      language={{ name: "English" }}
      handleClose={() => {}}
    />
  ));
