import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";

import Loading from "../components/Loading";
import { PostForm } from "../components/organism/PostForm";

storiesOf("Loading", module).add("standard", () => <Loading />);

storiesOf("PostForm", module).add("standard", () =>
  React.createElement(() => {
    const [lines, setLines] = useState<string[]>([""]);
    return <PostForm lines={lines} setLines={setLines} />;
  })
);
