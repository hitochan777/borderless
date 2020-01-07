import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Button,
  Fab
} from "@material-ui/core";
import { Add as AddIcon, AccountCircle } from "@material-ui/icons";
import firebase from "firebase/app";
import "firebase/auth";
import { useApolloClient } from "@apollo/react-hooks";

import { UidContext } from "@/context";
import { useViewer } from "@/hooks/useViewer";
import { FullSearchBox } from "./molecule/SearchBox";
import { useSetLoadingMutation, useLogoutMutation } from "@/generated/types";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    createFab: {
      position: "fixed",
      bottom: 20,
      right: 20
    }
  })
);

const useSignOut = () => {
  const { setUid } = useContext(UidContext);
  const [setLoading] = useSetLoadingMutation();
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const router = useRouter();
  const signOut = async () => {
    setLoading({ variables: { loading: true } });
    try {
      await firebase.auth().signOut();
      apolloClient.resetStore();
      await logout();
      setUid(null);
      setLoading({ variables: { loading: false } });
      router.push("/");
    } catch (error) {
      console.log(error);
      console.error("Faild to sign out");
      setLoading({ variables: { loading: false } });
    }
  };
  return signOut;
};

const Navbar: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const { viewer } = useViewer();
  const signOut = useSignOut();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ marginBottom: 10 }}>
        <Toolbar>
          <Link href="/">
            <Typography variant="h6" className={classes.title}>
              Borderless
            </Typography>
          </Link>
          <Box marginRight={1}>
            <FullSearchBox
              executeSearch={async query => {
                router.push(`/search?lang=${query.language}`);
              }}
            />
          </Box>
          {viewer ? (
            <>
              <MenuItem>
                <Link
                  href="/[username]"
                  as={`/${viewer ? viewer.username : ""}`}
                >
                  <AccountCircle />
                </Link>
              </MenuItem>
              <Button color="inherit" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button color="inherit">Sign in</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Fab color="primary" aria-label="add" className={classes.createFab}>
        <Link href="/post/new">
          <AddIcon />
        </Link>
      </Fab>
    </div>
  );
};

export default Navbar;
