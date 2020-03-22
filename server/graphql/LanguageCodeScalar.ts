import { scalarType } from "nexus";
import { UserInputError } from "apollo-server-micro";

import { Language } from "../value/language";

export const LanguageScalar = scalarType({
  name: "LanguageCode",
  serialize: (value: string) => {
    const lang = new Language(value); // validate string
    return lang.code;
  },
  parseValue: (value) => {
    try {
      const lang = new Language(value);
      return lang;
    } catch (e) {
      throw new UserInputError("Invalid language", {});
    }
  },
  parseLiteral: (ast) => {
    if (ast.kind !== "StringValue") {
      return null;
    }
    try {
      const lang = new Language(ast.value);
      return lang;
    } catch (e) {
      throw new UserInputError("Invalid language", {});
    }
  },
  asNexusMethod: "language",
});
