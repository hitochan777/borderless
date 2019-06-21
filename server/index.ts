import { ApolloServer, gql, addMockFunctionsToSchema } from "apollo-server";

import { schema } from "./schema";

addMockFunctionsToSchema({ schema });
const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready a ${url}`);
});
