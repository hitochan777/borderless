import React from "react";
import Link from "next/link";
import { Box, Flex, Heading } from "rebass";

import { useStateValue } from "../store";

const Navbar = () => {
  const { state, actions } = useStateValue();

  return (
    <Flex
      alignItems="center"
      style={{ backgroundColor: "#00a651", fontFamily: "Sans-Serif;" }}
    >
      <Heading fontSize={[4, 5]} color="white">
        Borderless
      </Heading>
      <Box mx="auto">
        <Link href="/about">
          <a>About</a>
        </Link>
      </Box>
      <Box mx="auto">
        <div>
          {state.user ? (
            <div>
              <Link href="#">
                <a onClick={actions.signOut}>Logout</a>
              </Link>
            </div>
          ) : (
            <>
              <div>
                <Link href="/signin">
                  <a>Sign in</a>
                </Link>
              </div>
              <div>
                <Link href="/signin">
                  <a>Sign up</a>
                </Link>
              </div>
            </>
          )}
        </div>
      </Box>
    </Flex>
  );
};

export default Navbar;
