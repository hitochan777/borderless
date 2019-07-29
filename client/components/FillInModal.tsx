import React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, FormikProps } from "formik";
import { query, types, mutation, params } from "typed-graphqlify";
import gql from "graphql-tag";

import { MultiSelect } from "./molecule/MultiSelect";
import { useQuery, useMutation } from "react-apollo-hooks";
import Loading from "./Loading";

interface Props {
  open: boolean;
}

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

interface FormValues {
  username: string;
  email: string;
  fluentLanguages: string[];
  learningLanguages: string[];
}

const GetLanguagesQuery = {
  langs: [
    {
      id: types.string,
      name: types.string
    }
  ]
};

const GET_LANGUAGES = gql(query(GetLanguagesQuery));

const UpdateUserReturnObject = {
  id: types.string
}
const UpdateUserMutation = mutation(
  "updateUserMutation",
  params(
    { $id: "ID!", $input: "UserInput!" },
    {
      userUpdate: params(
        { id: "$id", input: "$input" },
        UpdateUserReturnObject
      )
    }
  )
);

const SIGN_UP = gql(UpdateUserMutation);

export const FillInModal: React.StatelessComponent<Props> = ({
  open,
}) => {
  const [ updateUser, {updateUserLoading} ] = useMutation<typeof UpdateUserReturnObject>(SIGN_UP)
  const { data, error, loading } = useQuery<typeof GetLanguagesQuery>(
    GET_LANGUAGES
  );
  if (error || data === undefined) {
    throw error;
  }
  if (loading) {
    return <Loading />;
  }
  const LANGUAGES = data.langs.map(({ id, name }) => ({
    value: id,
    name
  }));
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        fluentLanguages: [],
        learningLanguages: []
      }}
      onSubmit={onSubmit}
      render={({
        handleChange,
        handleSubmit,
        values
      }: FormikProps<FormValues>) => (
        <StyledForm>
          <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Fill in the information below before starting your journey!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                name="username"
                label="Username"
                type="text"
                value={values.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={values.email}
                onChange={handleChange}
                fullWidth
              />
              <MultiSelect
                id="fluent-languages"
                value={values.fluentLanguages}
                name="fluentLanguages"
                onChange={handleChange}
                options={LANGUAGES}
                label="Fluent Languages"
              />
              <MultiSelect
                id="learning-languages"
                name="learningLanguages"
                value={values.learningLanguages}
                onChange={handleChange}
                options={LANGUAGES}
                label="Learning Languages"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmit as any} color="primary">
                Let's Go!
              </Button>
            </DialogActions>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Dialog>
        </StyledForm>
      )}
    ></Formik>
  );
};
