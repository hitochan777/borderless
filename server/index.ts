import { ApolloServer, gql } from "apollo-server";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { schema } from "./schema";

const server = new ApolloServer(schema);

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready a ${url}`);
});

// declare const module: any;
// if (module.hot) {
//   module.hot.accept((error: Error) => {
//     console.error(error);
//   });
//   module.hot.dispose(async () => {
//     await server.stop();
//   });
// }
