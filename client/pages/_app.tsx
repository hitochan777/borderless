import React from "react";
import App, { Container, NextAppContext } from "next/app";
import { ApolloProvider } from "react-apollo-hooks";
import ApolloClient from "apollo-client";
import { NextContext } from "next";
import nextCookie from "next-cookies";

import "../firebase";
import { StateProvider } from "../store";
import { useAuthEffect } from "../useAuthEffect";
import withApolloClient from "../lib/with-apollo-client";
import redirect from "../lib/redirect";

// const compose = (...components: React.ReactType<any>[]) => (
//   Component: React.ReactType<any>
// ) =>
//   components
//     .reverse()
//     .reduce(
//       (wrappedComponent, Wrapper) => <Wrapper>{wrappedComponent}</Wrapper>,
//       <Component />
//     );

// const PUBLIC_PAGES = [
//   "/",
//   "/signin",
//   "/signup",
//   "/about"
// ];

// const auth = (context: NextContext) {
//   const { token } = nextCookie(context);
//   if (!PUBLIC_PAGES.includes(context.pathname) && !token) {
//     return redirect(context, "/signin");
//   }
//   return token;
// }

// const withAuth = App => {
//   return class Authorizer extends React.Component {
//     static async getInitialProps(context: NextAppContext) {
//       const { ctx } = context;
//       const token = auth(ctx);

//       const componentProps =
//         App.getInitialProps && (await App.getInitialProps(context));

//       return { ...componentProps, token };
//     }

//     constructor(props) {
//       super(props);
//     }

//     render() {
//       return <App {...this.props} />;
//     }
//   };
// };

const AuthProvider = ({ children }: { children: any }) => {
  useAuthEffect();
  return children;
};

class MyApp extends App<{ apolloClient: ApolloClient<any> }> {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (ctx.res) {
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <StateProvider>
          <ApolloProvider client={apolloClient}>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </ApolloProvider>
        </StateProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
