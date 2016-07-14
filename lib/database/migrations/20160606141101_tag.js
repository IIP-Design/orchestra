exports.up = (knex) => knex.schema.createTable('tag', (table) => {
  table.increments('id').primary();
  table.string('title').notNullable();
  table.integer('parent_id').unsigned().references('id').inTable('tag');
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('tag').catch((err) => console.error(err));
