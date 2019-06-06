import { ApolloServer, gql } from "apollo-server";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

declare const module: any;
if (module.hot) {
  module.hot.accept((error: Error) => {
    console.error(error);
  });
  module.hot.dispose(async () => {
    await server.stop();
  });
}
