import React, { useState } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { MultiSelect } from "./molecule/MultiSelect";

interface Props {
  open: boolean;
  handleSubmit: () => void;
}

const LANGUAGES = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder"
];

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

export const FillInModal: React.StatelessComponent<Props> = ({
  open,
  handleSubmit
}) => {
  const [fluentLanguages, setFluentLanguages] = useState([]);
  const [learningLanguages, setLearningLanguages] = useState([]);
  const handleFluentLanguagesChange = (event: any) => {
    setFluentLanguages(event.target.value);
  };
  const handleLearningLanguagesChanges = (event: any) => {
    setLearningLanguages(event.target.value);
  };
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the information below before starting your journey!
        </DialogContentText>
        <StyledForm>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
          <MultiSelect
            id="fluent-languages"
            value={fluentLanguages}
            handleChange={handleFluentLanguagesChange}
            options={LANGUAGES}
            label="Fluent Languages"
          />
          <MultiSelect
            id="learning-languages"
            value={learningLanguages}
            handleChange={handleLearningLanguagesChanges}
            options={LANGUAGES}
            label="Learning Languages"
          />
        </StyledForm>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Let's Go!
        </Button>
      </DialogActions>
    </Dialog>
  );
};
