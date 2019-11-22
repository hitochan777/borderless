import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Router from "next/router";
import { useMutation } from "@apollo/react-hooks";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import Layout from "@/layout/default";
import { Editor, useEditorState } from "@/components/molecule/Editor";
import LanguageSelector from "@/components/molecule/LanguageSelector";
import { POST_CREATE_MUTATION } from "@/constant/graphql";
import {
  PostCreateMutation,
  PostCreateMutationVariables
  // PostInput
} from "@/generated/types";

const useCreatePost = () => {
  const [createPost, { loading, error }] = useMutation<
    PostCreateMutation,
    PostCreateMutationVariables
  >(POST_CREATE_MUTATION);
  return { createPost, loading, error };
};

const PostNewPage: NextPage = () => {
  const [editorState, setEditorState] = useEditorState();
  const [language, setLanguage] = useState<string>("");
  const { createPost, loading, error } = useCreatePost();

  const handleSubmit = async (isDraft = true) => {
    await createPost({
      variables: {
        post: {
          // TODO: lines: JSON.stringify(editorState.toJSON()),
          lines: [],
          language: +language,
          isDraft
        }
      }
    });
    Router.push("/me");
  };

  useEffect(() => {
    if (error) {
      alert("I am sorry but something happened during submission");
    }
  }, [error]);

  return (
    <Layout>
      <Container maxWidth="sm">
        <LanguageSelector
          label="Language"
          value={language}
          onChange={value => {
            setLanguage(value);
          }}
        />
        <Box mt={4}>
          <Editor
            slateKey="slateKey"
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </Box>
        <Box mt={4}>
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit(false);
            }}
            disabled={loading}
            color="secondary"
          >
            {loading ? "Submitting..." : "Publish"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit(true);
            }}
            disabled={loading}
            color="primary"
          >
            {loading ? "Submitting..." : "Save as Draft"}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default PostNewPage;
