import { objectType } from "nexus";
import { Timezone as TimezoneValue } from "../value/timezone";

export const Timezone = objectType({
  name: "Timezone",
  definition(t) {
    t.implements("Node");
    t.string("offset", {
      resolve(root) {
        return new TimezoneValue(root.id).offset;
      },
    });
  },
});
