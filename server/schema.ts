import {
  objectType,
  interfaceType,
  queryType,
  stringArg,
  enumType,
  intArg,
  arg,
  makeSchema
} from "nexus";

const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
    t.resolveType(() => null);
  }
});

const User = objectType({
  name: "User",
  definition(t) {
    t.implements(Node); // or t.implements("Node")
    t.string("username");
    t.string("email");
  }
});

const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements(Node); // or t.implements("Node")
    t.list.field("lines", {
      type: "Line",
      resolve(root, args, ctx) {}
    });
    t.field("user", "User");
  }
});

const Line = objectType({
  name: "Line",
  definition(t) {
    t.implements(Node); // or t.implements("Node")
    t.list.field("tweets", {
      type: "Tweet",
      resolve(root, args, ctx) {}
    });
    t.field("post", "Post");
    t.string("text");
  }
});

const Tweet = objectType({
  name: "Tweet",
  definition(t) {
    t.implements(Node); // or t.implements("Node")
    t.list.field("replies", {
      type: "Tweet",
      resolve(root, args, ctx) {}
    });
    t.field("parentTweet", "Tweet");
    t.field("line", "Line");
    t.string("text");
  }
});

export const schema = makeSchema({
  types: [User, Node, Post, Line, Tweet]
  // or types: { Account, Node, Query }
  // or types: [Account, [Node], { Query }]
});
