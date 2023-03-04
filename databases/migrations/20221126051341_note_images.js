/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("note_images", t =>{
      t.increments("id");
      t.string("note_id").notNullable();
      t.foreign("note_id").references("id").inTable("notes").onDelete("CASCADE")
      t.string("image").notNullable();
      t.timestamps(true,true)
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable("note_images");
  };
  