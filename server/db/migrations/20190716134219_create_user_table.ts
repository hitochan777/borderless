import * as Knex from "knex";

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema.createTable("user", t => {
    t.increments("id");
    t.string("uid", 255).notNullable();
    t.string("username", 255).notNullable();
    t.string("email", 255).notNullable();
    t.text("fluentLanguages");
    t.text("learningLanguages");
  });
};

export const down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTable("user");
};
