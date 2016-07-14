exports.up = (knex) => knex.schema.createTable('media', (table) => {
  table.increments('id').primary();
  table.string('date_created').notNullable();
  table.string('date_modified').notNullable();
  table.string('title').notNullable();
  table.string('alt_text');
  table.string('img_caption');
  table.integer('media_type').unsigned().references('id').inTable('resource_type').notNullable();
  table.string('src_url').notNullable().unique();
  table.string('width');
  table.string('height');
  table.integer('duration');
  table.string('file_url').unique();
  table.integer('transcript').unsigned().references('id').inTable('resource');
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('media').catch((err) => console.error(err));
