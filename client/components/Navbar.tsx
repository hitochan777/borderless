import React from "react";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import styled from "styled-components";

import { useStateValue } from "../store";

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`;

const Navbar = () => {
  const { state, actions } = useStateValue();

  return (
    <AppBar position="static" style={{ marginBottom: 10 }}>
      <Toolbar>
        <StyledTypography variant="h6">
          <Link href="/">
            <a>Borderless</a>
          </Link>
        </StyledTypography>
        {state.user ? (
          <MenuItem>
            <Link href="#">
              <a onClick={actions.signOut}>Logout</a>
            </Link>
          </MenuItem>
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
  );
};

export default Navbar;
