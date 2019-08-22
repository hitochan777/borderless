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
import { types, mutation, params } from "typed-graphqlify";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { MultiSelect } from "./molecule/MultiSelect";
import Loading from "./Loading";
import { useStateValue } from "../store";
import { GET_LANGUAGES, GetLanguagesQuery } from "../constant/queries";

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

interface Props {
  open: boolean;
  formData: FormValues | undefined;
}

const UpdateUserReturnObject = {
  id: types.string
};
const UpdateUserMutation = mutation(
  "updateUserMutation",
  params(
    { $id: "String!", $user: "UserInput!" },
    {
      userUpdate: params({ id: "$id", user: "$user" }, UpdateUserReturnObject)
    }
  )
);

const SIGN_UP = gql(UpdateUserMutation);

export const FillInModal: React.StatelessComponent<Props> = ({
  open,
  formData = {
    email: "",
    username: "",
    fluentLanguages: [],
    learningLanguages: []
  }
}) => {
  const { state } = useStateValue();
  const [updateUser, { loading: signupLoading }] = useMutation<
    typeof UpdateUserReturnObject
  >(SIGN_UP);

  const handleSubmit = async (values: FormValues) => {
    if (!state.user) {
      throw new Error("uid should not be empty when updating user");
    }
    await updateUser({ variables: { id: state.user, user: values } });
  };

  const { data, error, loading: getLanguageLoading } = useQuery<
    typeof GetLanguagesQuery
  >(GET_LANGUAGES);
  if (error || data === undefined) {
    throw error;
  }
  if (signupLoading || getLanguageLoading) {
    return <Loading />;
  }
  const LANGUAGES = data.langs.map(({ id, name }) => ({
    value: id,
    name
  }));
  return (
    <Formik
      initialValues={formData}
      onSubmit={handleSubmit}
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
