import React, { useState, useEffect } from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import Layout from "@/layout/default";
import { Editor, useEditorState } from "@/components/molecule/Editor";
import LanguageSelector from "@/components/molecule/LanguageSelector";
import {
  POST_UPDATE_MUTATION,
  FETCH_POST_BY_ID_QUERY
} from "@/constant/graphql";
import {
  PostUpdateMutation,
  PostUpdateMutationVariables,
  FetchPostByIdQuery,
  FetchPostByIdQueryVariables
} from "@/generated/types";
import { transformToGql, transformfromGql } from "@/service/slate";

const usePostById = (id: number) => {
  const { data, loading, error } = useQuery<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >(FETCH_POST_BY_ID_QUERY, { variables: { id } });
  return { data, loading, error };
};

const useUpdatePost = () => {
  const [updatePost, { loading, error }] = useMutation<
    PostUpdateMutation,
    PostUpdateMutationVariables
  >(POST_UPDATE_MUTATION);
  return { updatePost, loading, error };
};

interface Props {
  id: number;
}

const PostEditPage: NextPage<Props> = ({ id }) => {
  const {
    data: fetchPostData,
    loading: fetchPostLoading,
    error: fetchPostError
  } = usePostById(id);
  const [editorState, setEditorState] = useEditorState();
  const [language, setLanguage] = useState<string>("");
  const {
    updatePost,
    loading: updatePostLoading,
    error: updatePostError
  } = useUpdatePost();
  useEffect(() => {
    if (!fetchPostLoading && fetchPostData) {
      const parsedEditorState = transformfromGql(fetchPostData.post.lines);
      setEditorState(parsedEditorState);
      setLanguage(fetchPostData.post.language.id);
    }
  }, [fetchPostLoading, fetchPostData]);

  const loading = updatePostLoading || fetchPostLoading;

  const handleSubmit = async (isDraft = true) => {
    await updatePost({
      variables: {
        id,
        post: {
          lines: transformToGql(editorState),
          language: +language,
          isDraft
        }
      }
    });
    Router.push("/me");
  };

  useEffect(() => {
    if (fetchPostError || updatePostError) {
      alert("I am sorry but something happened during submission");
    }
  }, [fetchPostError, updatePostError]);

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

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

PostEditPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<{ id: number }> => {
  const { id } = ctx.query;
  assert(typeof id === "string");
  return { id: +id };
};

export default PostEditPage;
