import React, { useEffect, useState } from "react";
import { Formik, FormikProps } from "formik";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import { NextPage } from "next";
import { query, params } from "typed-graphqlify";
import gql from "graphql-tag";
import Router from "next/router";
import Plain from "slate-plain-serializer";

import Layout from "@/layout/default";
import {
  GetViewerQuery,
  GetLanguagesQuery,
  UPDATE_POST,
  UpdatePostReturnObject,
  Post
} from "@/constant/queries";
import Loading from "@/components/Loading";
import {
  useEditorStore,
  EditorStoreContext,
  CHANGE_CONTENT_STATE
} from "@/components/organism/Editor/useEditorReducer";
import { Editor } from "@/components/organism/Editor";

interface FormValues {
  language: string;
}

interface Props {
  id: number;
}

const EditPage: NextPage<Props> = ({ id }) => {
  const editorStore = useEditorStore();
  const QUERY_STRING = query({
    post: params({ id: 8 }, Post),
    ...GetViewerQuery,
    ...GetLanguagesQuery
  });
  const { data, error, loading } = useQuery<
    typeof GetViewerQuery & typeof GetLanguagesQuery & { post: typeof Post }
  >(gql(QUERY_STRING));
  const [submitSignal, setSubmitSignal] = useState({
    isDraft: true,
    shouldSubmit: false,
    handleSubmit: () => {}
  });
  useEffect(() => {
    if (submitSignal.shouldSubmit) {
      submitSignal.handleSubmit();
      setSubmitSignal(state => ({ ...state, shouldSubmit: false }));
    }
  }, [submitSignal]);

  const [updatePost] = useMutation<
    typeof UpdatePostReturnObject,
    {
      id: number;
      post: {
        lines: { text: string; comment: string }[];
        language: number;
        isDraft: boolean;
      };
    }
  >(UPDATE_POST);

  useEffect(() => {
    if (!data || !data.post) {
      return;
    }
    const lines = data.post.lines.map(line => line.text).join("\n");
    editorStore.dispatch({
      type: CHANGE_CONTENT_STATE,
      payload: Plain.deserialize(lines)
    });
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("data is empty");
  }
  const allLanguageTable = data.langs.reduce<{ [key: string]: string }>(
    (table, { id, name }) => {
      table[id] = name;
      return table;
    },
    {}
  );

  const learningLanguages = data.viewer.learningLanguages.map(id => ({
    value: `${id}`,
    name: allLanguageTable[id]
  }));

  const handleSubmit = async (values: FormValues) => {
    await updatePost({
      variables: {
        id,
        post: {
          content: JSON.stringify(editorStore.state.contentState.toJSON()),
          language: +values.language,
          isDraft: submitSignal.isDraft
        }
      }
    });
    Router.push("/me");
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Formik
          initialValues={{
            language: data.post.language.id
          }}
          onSubmit={handleSubmit}
          render={({
            submitForm,
            handleChange,
            values
          }: FormikProps<FormValues>) => (
            <form>
              <FormControl fullWidth>
                <Select
                  name="language"
                  value={values.language}
                  onChange={handleChange}
                  input={<Input id="language" />}
                >
                  {learningLanguages.map(({ value, name }, index) => (
                    <MenuItem key={index} value={value}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <EditorStoreContext.Provider value={editorStore}>
                  <Editor />
                </EditorStoreContext.Provider>
              </FormControl>
              <Box mr={2}>
                {(props: any) => (
                  <Button
                    {...props}
                    variant="contained"
                    onClick={() => {
                      setSubmitSignal({
                        isDraft: true,
                        shouldSubmit: true,
                        handleSubmit: () => {
                          submitForm();
                        }
                      });
                    }}
                    color="primary"
                  >
                    Save as Draft
                  </Button>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  setSubmitSignal({
                    isDraft: false,
                    shouldSubmit: true,
                    handleSubmit: () => {
                      submitForm();
                    }
                  });
                }}
                color="secondary"
              >
                Publish
              </Button>
            </form>
          )}
        ></Formik>
      </Container>
    </Layout>
  );
};

EditPage.getInitialProps = async ({ query }) => {
  const { id } = query;
  if (typeof id !== "string") {
    throw new Error("unexpected type in id");
  }
  return { id: +id as number };
};

export default EditPage;
