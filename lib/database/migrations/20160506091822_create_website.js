exports.up = (knex, Promise) => knex.schema.createTable('website', (table) => {
  table.increments('id').primary();
  table.string('name').notNullable();
  table.string('url').notNullable().unique();

  // Store times as JSON string
  table.string('date_checked').notNullable();
})
.then(() => knex.schema.createTable('category', (table) => {
  table.increments('id').primary();
  table.string('title').notNullable();
  table.integer('parent_id').unsigned().references('id').inTable('category');
}))
.catch((e) => console.log(e));

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('website'),
  knex.schema.dropTable('category'),
])
.catch((e) => console.log(e));
