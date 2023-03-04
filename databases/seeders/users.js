const bcrypt = require("bcrypt");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) { 
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: require("crypto").randomUUID(),
      username: "backend27",
      password: bcrypt.hashSync("backend123", 10),
      role: "admin",
      name: "Backend Digital Platfrom "
    },
  ]);
};
