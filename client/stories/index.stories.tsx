import React from "react";
import { storiesOf } from "@storybook/react";

import Loading from "@/components/Loading";
import { Editor } from "@/components/organism/Editor";
import { CommentItem } from "@/components/molecule/CommentItem";
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
