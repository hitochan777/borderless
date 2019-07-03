import { ApolloServer, gql, addMockFunctionsToSchema } from "apollo-server";

import { schema } from "./schema";

addMockFunctionsToSchema({ schema });
const server = new ApolloServer({
  schema,
  formatResponse: (response: any) => {
    console.log(response);
    return response;
  }
});

const main = async () => {
  const { url } = await server.listen({ port: 3001 });
  console.log(`🚀  Server ready at ${url}`);
};

main();
