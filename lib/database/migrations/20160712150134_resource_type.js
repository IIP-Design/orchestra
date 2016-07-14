exports.up = (knex) => knex.schema.createTable('resource_type', (table) => {
  table.increments('id').primary();
  table.string('title').notNullable().unique();
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('resource_type').catch((err) => console.error(err));

