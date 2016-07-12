exports.up = (knex, Promise) => knex.schema.createTable('glossary_term', (table) => {
  table.increments('id').primary();
  table.string('date_created').notNullable();
  table.string('date_modified').notNullable();
  table.string('title').notNullable().unique();
  table.string('description').notNullable();
}).catch((err) => console.error(err));

exports.down = (knex, Promise) => knex.schema.dropTable('glossary_term').catch((err) => console.error(err));
