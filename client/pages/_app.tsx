import React from "react";
import App, { Container, NextAppContext } from "next/app";

import "../firebase";
import { StateProvider } from "../store";
import { useAuthEffect } from "../useAuthEffect";

const AuthProvider = ({ children }: { children: any }) => {
  useAuthEffect();
  return children;
};

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
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
        <AuthProvider>
          <Container>
            <Component {...pageProps} />
          </Container>
        </AuthProvider>
      </StateProvider>
    );
  }
}

export default MyApp;
