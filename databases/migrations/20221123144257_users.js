/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", t => {
    t.string("id", 36).primary();
    t.string("username", 100).unique().notNullable();
    t.string("password").notNullable();
    t.enum("role" , ["admin","member"] ).notNullable();
    t.string("name", 100);
    t.string("avatar", 100);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
