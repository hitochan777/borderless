import React from "react";
import { Formik, FormikProps } from "formik";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import { query, mutation, params, types } from "typed-graphqlify";
import gql from "graphql-tag";
import Router from "next/router";

import Layout from "../../layout/default";
import { GetViewerQuery, GetLanguagesQuery } from "../../constant/queries";
import Loading from "../../components/Loading";
import {
  useEditorStore,
  EditorState
} from "../../components/organism/Editor/useEditorReducer";
import { Editor } from "../../components/organism/Editor";

interface FormValues {
  language: string;
}

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

const NewPage = () => {
  const editorStore = useEditorStore();
  const { data, error, loading } = useQuery<
    typeof GetViewerQuery & typeof GetLanguagesQuery
  >(gql(query({ ...GetViewerQuery, ...GetLanguagesQuery })));

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

  const [createPost] = useMutation<
    typeof CreatePostReturnObject,
    { post: { lines: EditorState["lines"]; language: number } }
  >(CREATE_POST);

  const handleSubmit = async (values: FormValues) => {
    await createPost({
      variables: {
        post: {
          lines: editorStore.state.lines,
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
            language: ""
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

export default NewPage;
