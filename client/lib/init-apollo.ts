import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import ApolloClient from "apollo-client";

// import { logger } from "../../logger";

interface ApolloInitOptions {
  getToken: () => string | undefined;
}

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const isBrowser = typeof window !== "undefined";

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  (global as any).fetch = fetch;
}

const createAuthorizationLink = ({ getToken }: ApolloInitOptions) =>
  setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      // logger.error(
      //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      // )
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    // logger.error(`[Network error]: ${networkError}`);
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_ENDPOINT,
  credentials: "same-origin"
});

const create = (initialState: any, options: ApolloInitOptions) =>
  new ApolloClient({
    link: ApolloLink.from([
      onErrorLink,
      createAuthorizationLink(options),
      httpLink
    ]),
    cache: new InMemoryCache().restore(initialState || {}),
    ssrMode: !isBrowser
  });

const initApollo = (initialState: any = {}, options: ApolloInitOptions) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
};

export default initApollo;
