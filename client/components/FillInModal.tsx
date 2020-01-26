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
import { useQuery, useMutation } from "@apollo/react-hooks";

import { MultiSelect } from "./molecule/MultiSelect";
import Loading from "./Loading";
import {
  FETCH_LANGUAGES_QUERY,
  USER_UPDATE_MUTATION
} from "@/constant/graphql";
import {
  FetchLanguagesQuery,
  UserUpdateMutation,
  UserUpdateMutationVariables
} from "@/generated/types";
import { useUid } from "@/store";

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

export const FillInModal: React.FC<Props> = ({
  open,
  formData = {
    email: "",
    username: "",
    fluentLanguages: [],
    learningLanguages: []
  }
}) => {
  const [
    updateUser,
    { loading: signupLoading, error: signupError }
  ] = useMutation<UserUpdateMutation, UserUpdateMutationVariables>(
    USER_UPDATE_MUTATION
  );
  const uid = useUid();

  const handleSubmit = async (values: FormValues): Promise<void> => {
    if (!uid) {
      throw new Error("uid should not be empty when updating user");
    }
    await updateUser({
      variables: {
        user: {
          ...values,
          fluentLanguages: values.fluentLanguages,
          learningLanguages: values.learningLanguages
        }
      }
    });
  };

  const {
    data,
    error: getLanguageError,
    loading: getLanguageLoading
  } = useQuery<FetchLanguagesQuery>(FETCH_LANGUAGES_QUERY);
  if (signupLoading || getLanguageLoading) {
    return <Loading />;
  }
  if (signupError) {
    throw new Error("Error during signup");
  }
  if (getLanguageError) {
    throw new Error("Error during fetching languages");
  }
  if (!data) {
    throw new Error("Fetched data is empty");
  }
  const LANGUAGES = data.langs.map(({ id, name }) => ({
    value: id,
    name
  }));
  return (
    <Formik initialValues={formData} onSubmit={handleSubmit}>
      {({ handleChange, handleSubmit, values }: FormikProps<FormValues>) => (
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
                {"Let's Go!"}
              </Button>
            </DialogActions>
          </Dialog>
        </StyledForm>
      )}
    </Formik>
  );
};
