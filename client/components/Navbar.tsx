import React from "react";
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

import { useViewer } from "@/hooks/useViewer";
import { useStateValue } from "@/store";
import { FullSearchBox } from "./molecule/SearchBox";

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

const Navbar: React.StatelessComponent = () => {
  const { state, actions } = useStateValue();
  const classes = useStyles();
  const router = useRouter();
  const { viewer } = useViewer();

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
          {state.user ? (
            <>
              <MenuItem>
                <Link href="/post/new">
                  <CreateIcon />
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href={`/${viewer ? viewer.username : ""}`}>
                  <AccountCircle />
                </Link>
              </MenuItem>
              <Button color="inherit" onClick={actions.signOut}>
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
