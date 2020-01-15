import React, { useState } from "react";
import App, { AppContext } from "next/app";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-client";
import { NextPageContext } from "next";
import nextCookie from "next-cookies";
import { ThemeProvider } from "@material-ui/core";

import { appWithTranslation } from "@/i18n";
import { theme } from "@/constant/theme";
import "@/lib/firebase";
import { useAuthEffect } from "@/hooks/useAuthEffect";
import withApolloClient from "@/lib/with-apollo-client";
import { UidContext } from "@/context";

const auth = async (context: NextPageContext) => {
  let user = null;
  const { session: sessionCookie } = nextCookie(context);
  if (context.req && sessionCookie) {
    user = (context.req as any).headers.uid;
  }
  return { user };
};

const withAuth = (
  App: React.ComponentType<any> & { getInitialProps?: Function }
) => {
  const WithAuth = ({ ...props }) => {
    const [uid, setUid] = useState<string | null>(props.user);
    return (
      <UidContext.Provider value={{ uid, setUid }}>
        <App {...props} />
      </UidContext.Provider>
    );
  };

  WithAuth.getInitialProps = async (context: AppContext) => {
    const { ctx } = context;
    const { user } = await auth(ctx);

    const componentProps =
      App.getInitialProps && (await App.getInitialProps(context));

    return { ...componentProps, user };
  };
  return WithAuth;
};

const AuthProvider = ({ children }: { children: any }) => {
  useAuthEffect();
  return children;
};

class MyApp extends App<{ apolloClient: ApolloClient<any> }> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ApolloProvider>
      </ThemeProvider>
    );
  }
}

export default appWithTranslation(withApolloClient(withAuth(MyApp)));
