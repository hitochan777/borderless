import React, { useContext, useState } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  IconButton,
} from "@material-ui/core";
import { Add as AddIcon, AccountCircle } from "@material-ui/icons";
import "firebase/auth";
import firebase from "firebase/app";
import { useApolloClient } from "@apollo/react-hooks";

import { UidContext } from "@/context";
import { useViewer } from "@/hooks/useViewer";
import { FullSearchBox } from "./molecule/SearchBox";
import { useSetLoadingMutation, useLogoutMutation } from "@/generated/types";
import { Box } from "@material-ui/core";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    createFab: {
      position: "fixed",
      bottom: 20,
      right: 20,
    },
    appbar: {
      marginBottom: "60px",
    },
    toolbar: {
      width: "1000px",
      margin: "0 auto",
    },
  })
);

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const classes = useStyles();
  const router = useRouter();
  const { viewer } = useViewer();
  const signOut = useSignOut();
  const theme = useTheme();
  const isLargerThanSm = useMediaQuery(theme.breakpoints.up("sm"));

  const isMenuOpen = Boolean(anchorEl);

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openProfileMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="profile-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={closeMenu}
    >
      <MenuItem>
        <Link href="/[username]" as={`/${viewer?.username}`}>
          <a>Profile</a>
        </Link>
      </MenuItem>
      <MenuItem onClick={signOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar
        className={classes.appbar}
        position="static"
        color="transparent"
        elevation={0}
      >
        <Toolbar className={classes.toolbar}>
          <Link href="/">
            <Typography variant="h6" className={classes.title}>
              Borderless
            </Typography>
          </Link>
          <Box marginRight={1}>
            {isLargerThanSm && (
              <FullSearchBox
                placeholder="Choose language"
                executeSearch={async (query) => {
                  router.push(`/search?lang=${query.language}`);
                }}
              />
            )}
          </Box>
          {viewer ? (
            <>
              <Link href="/post/new">
                <Button color="primary" variant="contained">
                  <AddIcon />
                </Button>
              </Link>
              <IconButton onClick={openProfileMenu}>
                <AccountCircle />
              </IconButton>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button color="primary" variant="contained">
                  Sign in
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
};

export default Navbar;
