exports.up = (knex) => knex.schema.createTable('course', (table) => {
  table.increments('id').primary();
  table.string('date_created').notNullable();
  table.string('date_modified').notNullable();
  table.string('title').notNullable();
  table.string('description');
  table.string('excerpt');
  table.integer('featured_media').unsigned().references('id').inTable('media');
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('course').catch((err) => console.error(err));
