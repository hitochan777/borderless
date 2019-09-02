import React from "react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";

import Loading from "../components/Loading";
import { Editor } from "../components/organism/Editor";
import { useEditorStore } from "../components/organism/Editor/useEditorReducer";

storiesOf("Loading", module).add("standard", () => <Loading />);

storiesOf("Editor", module).add("standard", () =>
  React.createElement(() => {
    const store = useEditorStore()
    return <Editor store={store} />;
  })
);
