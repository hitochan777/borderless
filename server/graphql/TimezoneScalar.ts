import { scalarType } from "nexus";
import { Timezone, timezoneInfos } from "../value/timezone";

const assertStringIsTimezone = (maybeTimezone: string): Timezone => {
  if (
    !timezoneInfos
      .map(info => info.timezone)
      .includes(maybeTimezone as Timezone)
  ) {
    throw new Error(`${maybeTimezone} is not a valid timezone`);
  }
  return maybeTimezone as Timezone;
};

export const TimezoneScalar = scalarType({
  name: "Timezone",
  serialize: value => value,
  parseValue: value => {
    return new Date(value);
  },
  parseLiteral: ast => {
    if (ast.kind !== "StringValue") {
      return null;
    }
    return assertStringIsTimezone(ast.value);
  },
  asNexusMethod: "timezone"
});
