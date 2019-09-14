import * as Knex from "knex";

const TABLE_NAME = "repliable";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(TABLE_NAME, t => {
    t.increments("id");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable(TABLE_NAME);
}
