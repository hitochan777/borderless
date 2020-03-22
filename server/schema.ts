import { makeSchema } from "nexus";
import path from "path";

import * as allTypes from "./graphql";

export const schema = makeSchema({
  types: allTypes,
  outputs: {
    schema: path.join(__dirname, "schema.graphql"),
    typegen: path.join(__dirname, "typegen.ts"),
  },
  typegenAutoConfig: {
    contextType: "ctx.GraphQLContext",
    sources: [
      {
        alias: "ctx",
        source: path.join(__dirname, "types.ts"),
      },
      {
        alias: "entity_user",
        source: path.join(__dirname, "entity", "user.ts"),
      },
      {
        alias: "entity_post",
        source: path.join(__dirname, "entity", "post.ts"),
      },
      {
        alias: "entity_tweet",
        source: path.join(__dirname, "entity", "tweet.ts"),
      },
      {
        alias: "entity_line",
        source: path.join(__dirname, "entity", "line.ts"),
      },
      {
        alias: "entity_correction_group",
        source: path.join(__dirname, "entity", "correction_group.ts"),
      },
    ],
  },
});
