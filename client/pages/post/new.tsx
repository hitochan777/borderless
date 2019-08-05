import React from "react";
import TextField from "@material-ui/core/TextField";
import { Formik, FormikProps } from "formik";
import { useQuery, useMutation } from "react-apollo-hooks";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { mutation, params, types } from "typed-graphqlify";
import gql from "graphql-tag";

import Layout from "../../layout/default";
import { GET_VIEWER, GetViewerQuery } from "../../constant/queries";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import Loading from "../../components/Loading";
import Router from "next/router";

interface FormValues {
  text: string;
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
  const { data, error, loading } = useQuery<typeof GetViewerQuery>(GET_VIEWER);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("learning language is not an array");
  }

  const LANGUAGES = data.viewer.learningLanguages.map(id => ({
    value: `${id}`,
    name: `${id}`
  }));

  const createPost = useMutation<typeof CreatePostReturnObject>(CREATE_POST);

  const handleSubmit = async (values: FormValues) => {
    await createPost({
      variables: {
        post: {
          text: values.text,
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
            text: "",
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
                  {LANGUAGES.map(({ value, name }, index) => (
                    <MenuItem key={index} value={value}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="text"
                  name="text"
                  label="Content"
                  multiline
                  rows="10"
                  value={values.text}
                  onChange={handleChange}
                />
              </FormControl>
              <Button onClick={handleSubmit as any} color="primary">
                Post
              </Button>
            </form>
          )}
        ></Formik>
      </Container>
    </Layout>
  );
};

export default NewPage;
