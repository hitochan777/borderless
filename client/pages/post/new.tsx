import React from "react";
import { NextPage } from "next";
import Container from "@material-ui/core/Container";

import Layout from "@/layout/default";
import { Editor, useEditorState } from "@/components/molecule/Editor";

const PostNewPage: NextPage = () => {
  const [editorState, setEditorState] = useEditorState();

  return (
    <Layout>
      <Container maxWidth="sm">
        {/* <LanguageSelector /> */}
        <Editor
          slateKey="slateKey"
          editorState={editorState}
          setEditorState={setEditorState}
        />
      </Container>
    </Layout>
  );
};

export default PostNewPage;
