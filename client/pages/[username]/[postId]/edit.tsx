import React, { useState, useEffect } from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Container, Button, Box, Grid } from "@material-ui/core";

import Layout from "@/layout/default";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Editor, useEditorState } from "@/components/molecule/Editor";
import LanguageSelector from "@/components/molecule/LanguageSelector";
import {
  POST_UPDATE_MUTATION,
  FETCH_POST_BY_ID_QUERY,
} from "@/constant/graphql";
import {
  PostUpdateMutation,
  PostUpdateMutationVariables,
  FetchPostByIdQuery,
  FetchPostByIdQueryVariables,
} from "@/generated/types";
import { transformToGql, transformfromGql } from "@/service/slate";
import { assert } from "@/lib/assert";

const useUpdatePost = () => {
  const [updatePost, { loading, error }] = useMutation<
    PostUpdateMutation,
    PostUpdateMutationVariables
  >(POST_UPDATE_MUTATION);
  return { updatePost, loading, error };
};

interface Props {
  id: string;
  username: string;
}

const PostEditPage: NextPage<Props> = ({ id, username }) => {
  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useQuery<FetchPostByIdQuery, FetchPostByIdQueryVariables>(
    FETCH_POST_BY_ID_QUERY,
    { variables: { id } }
  );
  const { value, setValue } = useEditorState();
  const [language, setLanguage] = useState<string | null>("");
  const {
    updatePost,
    loading: updatePostLoading,
    error: updatePostError,
  } = useUpdatePost();

  useEffect(() => {
    if (!queryLoading && queryData) {
      const parsedEditorState = transformfromGql(queryData.post.lines);
      setValue(parsedEditorState);
      setLanguage(queryData.post.language.id);
    }
  }, [queryLoading, queryData]);

  const loading = updatePostLoading || queryLoading;

  const handleSubmit = async (isDraft = true) => {
    await updatePost({
      variables: {
        id,
        post: {
          lines: transformToGql(value),
          language: language || "",
          isDraft,
        },
      },
    });
    Router.push("/[username]/[postId]", `/${username}/${id}`);
  };

  useEffect(() => {
    if (queryError || updatePostError) {
      alert("I am sorry but something happened during submission");
    }
  }, [queryError, updatePostError]);

  return (
    <Layout>
      <Container>
        <LanguageSelector
          relatedOnly
          label="Language"
          value={language}
          onChange={(value) => {
            setLanguage(value);
          }}
        />
        <Box mt={4}>
          {/*<pre>{JSON.stringify(value, null, 2)}</pre>*/}
          <Editor value={value} setValue={setValue} />
        </Box>
        <BottomNavigation>
          <Box marginBottom={2}>
            <Grid container justify="center">
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit(false);
                }}
                disabled={loading}
                color="primary"
              >
                {loading ? "Submitting..." : "Publish"}
              </Button>
              <Box marginRight={2} />
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit(true);
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Save as Draft"}
              </Button>
            </Grid>
          </Box>
        </BottomNavigation>
      </Container>
    </Layout>
  );
};

PostEditPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<{ id: string; username: string }> => {
  const { postId, username } = ctx.query;
  assert(typeof postId === "string");
  assert(typeof username === "string");
  return { id: postId, username };
};

export default PostEditPage;
