exports.up = (knex) => knex.schema.createTable('website', (table) => {
  table.increments('id').primary();
  table.string('name').notNullable();
  table.string('url').notNullable().unique();

  // Store times as JSON string
  table.string('date_checked').notNullable();
}).then(() => {
  return knex.schema.createTable('category', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('parent_id').unsigned().references('id').inTable('category');
  })
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('website')
  .then(() => {
    return knex.schema.dropTable('category');
  })
  .catch((err) => console.error(err));
