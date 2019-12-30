import { inputObjectType } from "nexus";

export const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    t.string("username", { nullable: false });
    t.string("email", { nullable: false });
    t.list.field("fluentLanguages", {
      type: "String",
      nullable: false
    });
    t.list.field("learningLanguages", {
      type: "String",
      nullable: false
    });
  }
});
