import React from "react";
import { Grid, Box } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";

import Layout from "@/layout/default";
import { GoogleLoginButton } from "@/components/molecule/GoogleLoginButton";

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};

const SignIn: React.FC = () => {
  return (
    <Layout>
      <Box marginTop="30vh">
        <Grid container justify="center">
          <GoogleLoginButton
            onClick={() => {
              signIn();
            }}
          />
        </Grid>
      </Box>
    </Layout>
  );
};

export default SignIn;
