/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("labels", t =>{
      t.increments("id");
      t.string("user_id").notNullable();
      t.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
      t.string("name", 100).notNullable();
      t.timestamps(true,true);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable("labels");
  };
  