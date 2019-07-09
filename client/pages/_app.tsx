import React from "react";
import App, { Container, NextAppContext } from "next/app";
import { ApolloProvider } from "react-apollo-hooks";
import ApolloClient from "apollo-client";

import "../firebase";
import { StateProvider } from "../store";
import { useAuthEffect } from "../useAuthEffect";
import withApolloClient from "../lib/with-apollo-client";

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

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <StateProvider>
          <AuthProvider>
            <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
            </ApolloProvider>
          </AuthProvider>
        </StateProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
