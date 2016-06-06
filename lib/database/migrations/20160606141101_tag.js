exports.up = (knex, Promise) => knex.schema.createTable('tag', (table) => {
  table.increments('id').primary();
  table.string('title').notNullable();
  table.integer('parent_id').unsigned().references('id').inTable('tag');
});

exports.down = (knex, Promise) => knex.schema.dropTable('tag');
