import React from "react";
import { Grid, Box } from "@material-ui/core";

import { useStateValue } from "@/store";
import Layout from "@/layout/default";
import { GoogleLoginButton } from "@/components/molecule/GoogleLoginButton";

const SignIn: React.FC = () => {
  const { actions } = useStateValue();
  return (
    <Layout>
      <Box marginTop="30vh">
        <Grid container justify="center">
          <GoogleLoginButton onClick={() => actions.signIn()} />
        </Grid>
      </Box>
    </Layout>
  );
};

export default SignIn;
