exports.up = (knex) => knex.schema.createTable('language', (table) => {
  table.increments('id').primary();
  table.string('lang_code').notNullable().unique();
  table.string('title').notNullable();
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('language').catch((err) => console.error(err));
