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
import { POST_CREATE_MUTATION, FETCH_VIEWER_QUERY } from "@/constant/graphql";
import {
  PostCreateMutation,
  PostCreateMutationVariables
} from "@/generated/types";
import { useViewer } from "@/hooks/useViewer";
import { transformToGql } from "@/service/slate";

const useCreatePost = () => {
  const [createPost, { loading, error }] = useMutation<
    PostCreateMutation,
    PostCreateMutationVariables
  >(POST_CREATE_MUTATION, {
    refetchQueries: [{ query: FETCH_VIEWER_QUERY }]
  });
  return { createPost, loading, error };
};

const PostNewPage: NextPage = () => {
  const { value, setValue } = useEditorState();
  const [language, setLanguage] = useState<string>("");
  const { createPost, loading, error } = useCreatePost();
  const { viewer } = useViewer();

  useEffect(() => {
    if (!viewer || error) {
      alert("I am sorry but something happened during submission");
    }
  }, [error, viewer]);

  const handleSubmit = async (isDraft = true) => {
    if (!viewer) {
      throw new Error("viewer information is empty");
    }
    await createPost({
      variables: {
        post: {
          lines: transformToGql(value),
          language: +language,
          isDraft
        }
      }
    });
    Router.push(`/${viewer.username}`);
  };

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
          <Editor value={value} setValue={setValue} />
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
