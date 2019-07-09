import React from "react";
import App, { Container, AppContext } from "next/app";
import { ApolloProvider } from "react-apollo-hooks";
import ApolloClient from "apollo-client";
import { NextPageContext } from "next";
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

const PUBLIC_PAGES = ["/", "/signin", "/signup", "/about"];

const auth = async (context: NextPageContext) => {
  let user = null;
  const { session: sessionCookie } = nextCookie(context);
  if (!PUBLIC_PAGES.includes(context.pathname) && !sessionCookie) {
    redirect(context, "/signin");
  }
  if (context.req && sessionCookie) {
    user = (context.req as any).decodedIdToken.email;
  }
  return { user };
};

const withAuth = (
  App: React.ComponentType<any> & { getInitialProps?: Function }
) => {
  return class extends React.Component {
    static async getInitialProps(context: AppContext) {
      const { ctx } = context;
      const { user } = await auth(ctx);

      const componentProps =
        App.getInitialProps && (await App.getInitialProps(context));

      return { ...componentProps, user };
    }

    constructor(props: any) {
      super(props);
    }

    render() {
      return <App {...this.props} />;
    }
  };
};

const AuthProvider = ({ children }: { children: any }) => {
  useAuthEffect();
  return children;
};

class MyApp extends App<{ apolloClient: ApolloClient<any>; user: string }> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient, user } = this.props;
    console.log(user);

    return (
      <Container>
        <StateProvider initialState={{ currentUser: user }}>
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

export default withAuth(withApolloClient(MyApp));
