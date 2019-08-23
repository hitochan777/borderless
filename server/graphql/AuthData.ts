import { objectType } from "nexus";

export const AuthData = objectType({
  name: "AuthData",
  definition(t) {
    t.string("token");
  }
});
