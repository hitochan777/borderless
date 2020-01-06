import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import CreateIcon from "@material-ui/icons/Mail";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import { useApolloClient } from "@apollo/react-hooks";

import { UidContext } from "@/context";
import { useViewer } from "@/hooks/useViewer";
import { FullSearchBox } from "./molecule/SearchBox";
import { useSetLoadingMutation, useLogoutMutation } from "@/generated/types";

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
    }
  })
);

const useSignOut = () => {
  const { setUid } = useContext(UidContext);
  const [setLoading] = useSetLoadingMutation();
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const signOut = async () => {
    setLoading({ variables: { loading: true } });
    try {
      await firebase.auth().signOut();
      apolloClient.resetStore();
      await logout();
    } catch (error) {
      console.log(error);
      console.error("Faild to sign out");
    } finally {
      setUid(null);
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
          <FullSearchBox
            executeSearch={async query => {
              router.push(`/search?lang=${query.language}`);
            }}
          />
          {viewer ? (
            <>
              <MenuItem>
                <Link href="/post/new">
                  <CreateIcon />
                </Link>
              </MenuItem>
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
              <MenuItem>
                <Link href="/signin">
                  <a>Sign in</a>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/signin">
                  <a>Sign up</a>
                </Link>
              </MenuItem>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
