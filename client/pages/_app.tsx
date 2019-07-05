import React, { useContext, useEffect } from "react";
import firebase from "firebase";
import ky from "ky";
import App, { Container } from "next/app";

import { StateProvider } from "../store";

// const useAuth = () => {
//     const {setCurrentUser, setLoading, setTmpUser, currentUser} = useContext();
//     useEffect( async () => {
//     const result = await firebase.auth().getRedirectResult();
//     if (result.user) {
//       const token = await result.user.getIdToken();
//       // FIXME: const csrfToken = getCookie("csrfToken");
//       await ky.post("login.json", { json: { token } });
//     }

//     firebase.auth().onAuthStateChanged(async user => {
//       setTmpUser(user);
//       if (user) {
//         if (!$currentUser) {
//           setLoading(false);
//         //   if ($page.path === "/signup") {
//             // avoiding infinite loop
//             return;
//           }
//           //   goto("/signup");
//           return;
//         }
//       }
//       setUser(user);
//       setLoading(false);
//     });
//   });
// }

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <StateProvider>
        <Container>
          <Component {...pageProps} />
        </Container>
      </StateProvider>
    );
  }
}

export default MyApp;
