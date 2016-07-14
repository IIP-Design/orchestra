exports.up = (knex) => knex.schema.createTable('resource', (table) => {
  table.increments('id').primary();
  table.string('date_created').notNullable();
  table.string('date_modified').notNullable();
  table.string('title').notNullable();
  table.string('description').notNullable();
  table.string('url').notNullable().unique();
  table.integer('resource_type').unsigned().references('id').inTable('resource_type');
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('resource').catch((err) => console.error(err));
