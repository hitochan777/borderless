import { scalarType } from "nexus";

export const DateScalar = scalarType({
  name: "Date",
  serialize: value => value.getTime(),
  parseValue: value => {
    return new Date(value);
  },
  parseLiteral: ast => (ast.kind === "IntValue" ? new Date(ast.value) : null),
  asNexusMethod: "date"
});
