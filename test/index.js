const common = require('./common');
const knex = common.knex;
const config = common.config;


function getTest(name, path) {
  describe(name, () => require(path));
}


// Global before block to make sure we're starting with a totally clean DB
before(() => {
  return knex.migrate.rollback()
    .then(() => {
      return knex.migrate.latest();
    })
});


describe('Migrations test runner', () => {
  getTest('Website', './migrations/website.js');
  getTest('Category', './migrations/category.js');
  getTest('Tag', './migrations/tag.js');
  getTest('Language', './migrations/language.js');
  getTest('Resource Type', './migrations/resource_type.js');
  getTest('Resource', './migrations/resource.js');
  getTest('Glossary Term', './migrations/glossary_term.js');
  getTest('Media', './migrations/media.js');
  getTest('Instructor', './migrations/instructor.js');
  getTest('Lesson', './migrations/lesson.js');
  getTest('Course', './migrations/course.js');
  getTest('Quiz', './migrations/quiz.js');
  getTest('Course Lesson Join Table', './migrations/course_lesson.js');
  getTest('Course Category Join Table', './migrations/course_category.js');
  getTest('Lesson Tag Join Table', './migrations/lesson_tag.js');
  getTest('Lesson Media Join Table', './migrations/lesson_media.js');
  getTest('Lesson Glossary Join Table', './migrations/lesson_glossary.js');
  getTest('Lesson Instructor Join Table', './migrations/lesson_instructor.js');
  getTest('Lesson Quiz Join Table', './migrations/lesson_quiz.js');
  getTest('Lesson Resource Join Table', './migrations/lesson_resource.js');
});

describe('Application Configuration and Setup', () => {
  // Rollback the DB before the next test block
  before(() => {
    return knex.migrate.rollback();
  });

  getTest('Configuration', './application/configure.js');
  getTest('Setup', './application/setup.js');
});
