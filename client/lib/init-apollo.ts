import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";

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

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT,
  credentials: "same-origin"
});

const typeDefs = gql`
  extend type Query {
    uid: String
    loading: Boolean!
    errorMessage: String
  }

  extend type Mutation {
    setUid(user: String): Boolean!
    setLoading(loading: Boolean!): Boolean!
    setErrorMessage(errorMessage: String): Boolean!
  }
`;

const create = (
  initialState: any = {},
  initialLocalState: any = {},
  options: ApolloInitOptions
) => {
  const cache = new InMemoryCache().restore(initialState);
  cache.writeData(initialLocalState);
  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
          client.writeData({
            data: { errorMessage: graphQLErrors[0].message }
          });
        }
        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
        }
      }),
      createAuthorizationLink(options),
      httpLink
    ]),
    cache,
    ssrMode: !isBrowser,
    resolvers: {
      Mutation: {
        setUid: (_root, { uid }, { cache }) => {
          cache.writeData({ data: { uid } });
          return null;
        },
        setLoading: (_root, { loading }, { cache }) => {
          cache.writeData({ data: { loading } });
          return null;
        },
        setErrorMessage: (_root, { errorMessage }, { cache }) => {
          cache.writeData({ data: { errorMessage } });
          return null;
        }
      }
    },
    typeDefs
  });
  return client;
};

const initApollo = (
  initialState: any = {},
  initialLocalState: any = {},
  options: ApolloInitOptions
) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, initialLocalState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, initialLocalState, options);
  }

  return apolloClient;
};

export default initApollo;
