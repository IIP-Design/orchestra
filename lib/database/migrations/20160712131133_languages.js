exports.up = (knex, Promise) => knex.schema.createTable('language', (table) => {
  table.increments('id').primary();
  table.string('lang_code').notNullable().unique();
  table.string('title').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('language');
