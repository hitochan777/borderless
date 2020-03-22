import React from "react";
import { Box, Paper, Typography, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import "firebase/auth";

import Layout from "@/layout/default";
import { LoginButton } from "@/components/molecule/LoginButton";

type Provider = "google" | "twitter";

const signIn = (provider: Provider) => {
  const providerMap = {
    google: firebase.auth.GoogleAuthProvider,
    twitter: firebase.auth.TwitterAuthProvider,
  };
  if (!providerMap[provider]) {
    throw new Error(`Unknown provider ${provider}`);
  }
  const providerInstance = new providerMap[provider]();
  firebase.auth().signInWithRedirect(providerInstance);
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "300px",
    minWidth: "300px",
  },
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
          <LoginButton
            onClick={() => {
              signIn("google");
            }}
          >
            Sign in with Google
          </LoginButton>

          <Box marginTop={2} />
          <LoginButton
            onClick={() => {
              signIn("twitter");
            }}
          >
            Sign in with Twitter
          </LoginButton>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SignIn;
