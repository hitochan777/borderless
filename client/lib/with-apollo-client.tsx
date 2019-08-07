import React from "react";
import { AppContext } from "next/app";
import Head from "next/head";
import { getDataFromTree } from "@apollo/react-ssr";
import ApolloClient from "apollo-client";
import cookie from "cookie";

import initApollo from "./init-apollo";
import { IncomingMessage } from "http";

const isBrowser = typeof window !== "undefined";

function parseCookies(req?: IncomingMessage) {
  return req && cookie.parse(req.headers.cookie || "");
}

const withApolloClient = (
  App: React.ComponentType<any> & { getInitialProps?: Function }
) => {
  return class Apollo extends React.Component {
    static displayName = "withApollo(App)";
    apolloClient: ApolloClient<any>;
    static async getInitialProps(appContext: AppContext) {
      const {
        Component,
        router,
        ctx: { req }
      } = appContext;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appContext);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo(
        {},
        {
          getToken: () => {
            const parsed = parseCookies(req);
            return parsed && parsed["session"];
          }
        }
      );
      if (!isBrowser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState
      };
    }

    constructor(props: any) {
      super(props);
      this.apolloClient = initApollo(props.apolloState, {
        getToken: () => {
          return undefined;
        }
      });
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};

export default withApolloClient;
