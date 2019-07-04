import {
  ApolloServer,
  gql,
  addMockFunctionsToSchema
} from "apollo-server-micro";

import { schema } from "./schema";

addMockFunctionsToSchema({ schema });
const server = new ApolloServer({
  schema,
  formatResponse: (response: any) => {
    console.log(response);
    return response;
  }
});

export default server.createHandler();
