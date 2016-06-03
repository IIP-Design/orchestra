exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('website', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('url').notNullable().unique();

    // Store times as JSON string
    table.string('date_checked').notNullable();
  }),
]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('website')]);
