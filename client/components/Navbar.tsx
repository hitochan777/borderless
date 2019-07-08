import React from "react";
import Link from "next/link";

import { useStateValue } from "../store";

const Navbar = () => {
  const { state } = useStateValue();
  return (
    <ul>
      {state.currentUser ? (
        <li>
          <Link href="/logout">
            <a>Logout</a>
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
