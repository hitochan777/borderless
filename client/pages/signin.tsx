import React from "react";
import { Box, Paper, Typography, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import "firebase/auth";

import Layout from "@/layout/default";
import { GoogleLoginButton } from "@/components/molecule/GoogleLoginButton";

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "300px",
    minWidth: "300px"
  }
}));

const SignIn: React.FC = () => {
  const classes = useStyles();
  return (
    <Layout>
      <Container maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <Box marginTop={5} />
          <GoogleLoginButton
            onClick={() => {
              signIn();
            }}
          />
          <Box marginTop={2} />
          <GoogleLoginButton
            onClick={() => {
              signIn();
            }}
          />
          <Box marginTop={2} />
          <GoogleLoginButton
            onClick={() => {
              signIn();
            }}
          />
        </Paper>
      </Container>
    </Layout>
  );
};

export default SignIn;
