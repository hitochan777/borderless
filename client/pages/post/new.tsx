import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Router from "next/router";
import { useMutation } from "@apollo/react-hooks";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { mutation, params, types } from "typed-graphqlify";
import gql from "graphql-tag";

import Layout from "@/layout/default";
import { Editor, useEditorState } from "@/components/molecule/Editor";
import LanguageSelector from "@/components/molecule/LanguageSelector";

const useCreatePost = () => {
  const CreatePostReturnObject = {
    id: types.string
  };
  const CreatePostMutation = mutation(
    "createPostMutation",
    params(
      { $post: "PostInput!" },
      {
        postCreate: params({ post: "$post" }, CreatePostReturnObject)
      }
    )
  );

  const CREATE_POST = gql(CreatePostMutation);

  const [createPost, { loading, error }] = useMutation<
    typeof CreatePostReturnObject,
    {
      post: {
        content: string;
        language: number;
        isDraft: boolean;
      };
    }
  >(CREATE_POST);
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
          content: JSON.stringify(editorState.toJSON()),
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
