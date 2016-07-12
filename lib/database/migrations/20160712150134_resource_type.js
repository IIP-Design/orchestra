exports.up = (knex, Promise) => knex.schema.createTable('resource_type', (table) => {
  table.increments('id').primary();
  table.string('title').notNullable().unique();
});

exports.down = (knex, Promise) => knex.schema.dropTable('resource_type');
