exports.up = (knex) => knex.schema.createTable('course_lesson', (table) => {
  table.increments('id').primary();
  table.integer('course_id').unsigned().references('id').inTable('course');
  table.integer('lesson_id').unsigned().references('id').inTable('lesson');
}).then(() => {
  return knex.schema.createTable('course_category', (table) => {
    table.increments('id').primary();
    table.integer('course_id').unsigned().references('id').inTable('course');
    table.integer('category_id').unsigned().references('id').inTable('category');
  });
}).then(() => {
  return knex.schema.createTable('lesson_tag', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unsigned().references('id').inTable('lesson');
    table.integer('tag_id').unsigned().references('id').inTable('tag');
  });
}).then(() => {
  return knex.schema.createTable('lesson_media', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unsigned().references('id').inTable('lesson');
    table.integer('media_id').unsigned().references('id').inTable('media');
  });
}).then(() => {
  return knex.schema.createTable('lesson_glossary', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unsigned().references('id').inTable('lesson');
    table.integer('term_id').unsigned().references('id').inTable('glossary_term');
  });
}).then(() => {
  return knex.schema.createTable('lesson_instructor', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unsigned().references('id').inTable('lesson');
    table.integer('instructor_id').unsigned().references('id').inTable('instructor');
  });
}).then(() => {
  return knex.schema.createTable('lesson_quiz', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unsigned().references('id').inTable('lesson');
    table.integer('quiz_id').unsigned().references('id').inTable('quiz');
  });
}).then(() => {
  return knex.schema.createTable('lesson_resource', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unsigned().references('id').inTable('lesson');
    table.integer('resource_id').unsigned().references('id').inTable('resource');
  });
}).catch((err) => console.error(err));

exports.down = (knex) => knex.schema.dropTable('course_lesson')
  .then(() => {
    return knex.schema.dropTable('course_category');
  })
  .then(() => {
    return knex.schema.dropTable('lesson_tag');
  })
  .then(() => {
    return knex.schema.dropTable('lesson_media');
  })
  .then(() => {
    return knex.schema.dropTable('lesson_glossary');
  })
  .then(() => {
    return knex.schema.dropTable('lesson_instructor');
  })
  .then(() => {
    return knex.schema.dropTable('lesson_quiz');
  })
  .then(() => {
    return knex.schema.dropTable('lesson_resource');
  })
  .catch((err) => console.error(err));

