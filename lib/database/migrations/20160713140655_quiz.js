exports.up = (knex, Promise) => knex.schema.createTable('quiz', (table) => {
  table.increments('id').primary();
  table.string('date_created').notNullable();
  table.string('date_modified').notNullable();
  table.string('question').notNullable().unique();
  table.string('answer').notNullable();
}).catch((err) => console.error(err));

exports.down = (knex, Promise) => knex.schema.dropTable('quiz').catch((err) => console.error(err));
