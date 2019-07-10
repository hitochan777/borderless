import React from "react";
import Link from "next/link";

import { useStateValue } from "../store";

const Navbar = () => {
  const { state, actions } = useStateValue();

  return (
    <ul>
      {state.user ? (
        <li>
          <Link href="#">
            <a onClick={actions.signOut}>Logout</a>
          </Link>
        </li>
      ) : (
        <>
          <li>
            <Link href="/signin">
              <a>Sign in</a>
            </Link>
          </li>
          <li>
            <Link href="/signin">
              <a>Sign up</a>
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Navbar;
