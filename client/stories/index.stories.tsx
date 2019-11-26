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
    lines={["first line", "second line"]}
    isDraft={false}
    language={{ name: "English" }}
  />
));

storiesOf("Post", module)
  .add("without comment", () => (
    <PostPresenter
      id={1}
      user={{ username: "john" }}
      lines={["first line", "second line"]}
      isDraft={false}
      language={{ name: "English" }}
    />
  ))
  .add("with comment", () => (
    <PostPresenter
      id={1}
      user={{ username: "john" }}
      lines={["first line", "second line"]}
      isDraft={false}
      language={{ name: "English" }}
    />
  ));
