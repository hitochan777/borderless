import { objectType } from "@nexus/schema";

export const AuthData = objectType({
  name: "AuthData",
  definition(t) {
    t.string("token");
  },
});
