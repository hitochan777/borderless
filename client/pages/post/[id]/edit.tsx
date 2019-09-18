import React, { useEffect } from "react";
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
import { query } from "typed-graphqlify";
import gql from "graphql-tag";
import Router from "next/router";
import immutable from "immutable";

import Layout from "../../../layout/default";
import {
  GetViewerQuery,
  GetLanguagesQuery,
  UPDATE_POST,
  UpdatePostReturnObject,
  GetPostById
} from "../../../constant/queries";
import Loading from "../../../components/Loading";
import { useEditorStore } from "../../../components/organism/Editor/useEditorReducer";
import { Editor } from "../../../components/organism/Editor";

interface FormValues {
  language: string;
}

interface Props {
  id: number;
}

const EditPage: NextPage<Props> = ({ id }) => {
  const editorStore = useEditorStore();
  const { data, error, loading } = useQuery<
    typeof GetViewerQuery & typeof GetLanguagesQuery & typeof GetPostById
  >(gql(query({ ...GetViewerQuery, ...GetLanguagesQuery, ...GetPostById })));

  const [updatePost] = useMutation<
    typeof UpdatePostReturnObject,
    { id: number, post: { lines: { text: string; comment: string }[]; language: number } }
  >(UPDATE_POST);

  useEffect(() => {
    if (!data || !data.post) {
      return;
    }
    const lines = data.post.lines.map(line => {
      if (line.replies.length > 1) {
        throw new Error("Line reply should be one if it is in draft");
      }
      return {
        text: line.text,
        comment: {
          text: line.replies[0].text
        }
      };
    });
    editorStore.setState(
      immutable.fromJS({
        lines
      })
    );
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
          lines: editorStore.state.getPostable(),
          language: +values.language
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
            handleChange,
            handleSubmit,
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
                <Editor store={editorStore} />
              </FormControl>
              <Box mr={2}>
                {(props: any) => (
                  <Button
                    {...props}
                    variant="contained"
                    onClick={handleSubmit as any}
                    color="primary"
                  >
                    Save as Draft
                  </Button>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={handleSubmit as any}
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
