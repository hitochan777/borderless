import React from "react";
import { storiesOf } from "@storybook/react";

import Loading from "@/components/Loading";
import { Editor } from "@/components/organism/Editor";
import { CommentItem } from "@/components/molecule/CommentItem";
import { PostContent } from "@/components/organism/PostContent";
import { PostPresenter } from "@/components/organism/Post";
import { useEditorStore } from "@/components/organism/Editor/useEditorReducer";

storiesOf("Loading", module).add("standard", () => <Loading />);

storiesOf("Editor", module).add("standard", () =>
  React.createElement(() => {
    const store = useEditorStore();
    return <Editor store={store} />;
  })
);

storiesOf("CommentItem", module).add("standard", () => (
  <CommentItem
    commentId={2}
    username="john"
    createdAt={new Date(Date.now())}
    text="this is a comment"
    replyCount={3}
  ></CommentItem>
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
  ></PostContent>
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
