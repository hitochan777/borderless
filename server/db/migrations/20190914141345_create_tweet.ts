import * as Knex from "knex";

const TABLE_NAME = "tweet";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(TABLE_NAME, t => {
    t.primary(["id"]);
    t.integer("id").unsigned();
    t.foreign("id").references("repliable.id");
    t.integer("userId").unsigned();
    t.foreign("userId").references("user.id");
    t.integer("inReplyTo").unsigned();
    t.foreign("inReplyTo").references("repliable.id");
    t.integer("postId").unsigned();
    t.foreign("postId").references("post.id");
    t.text("text");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable(TABLE_NAME);
}
