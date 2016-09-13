const path = require('path');
const common = require(path.resolve('test/common.js'));
const knex = common.knex;


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


describe('Database: Migrations', () => {
  getTest('Website', './database/migrations/website.js');
  getTest('Category', './database/migrations/category.js');
  getTest('Tag', './database/migrations/tag.js');
  getTest('Language', './database/migrations/language.js');
  getTest('Resource Type', './database/migrations/resource_type.js');
  getTest('Resource', './database/migrations/resource.js');
  getTest('Glossary Term', './database/migrations/glossary_term.js');
  getTest('Media', './database/migrations/media.js');
  getTest('Instructor', './database/migrations/instructor.js');
  getTest('Lesson', './database/migrations/lesson.js');
  getTest('Course', './database/migrations/course.js');
  getTest('Quiz', './database/migrations/quiz.js');
  getTest('Course Lesson Join Table', './database/migrations/course_lesson.js');
  getTest('Course Category Join Table', './database/migrations/course_category.js');
  getTest('Lesson Tag Join Table', './database/migrations/lesson_tag.js');
  getTest('Lesson Media Join Table', './database/migrations/lesson_media.js');
  getTest('Lesson Glossary Join Table', './database/migrations/lesson_glossary.js');
  getTest('Lesson Instructor Join Table', './database/migrations/lesson_instructor.js');
  getTest('Lesson Quiz Join Table', './database/migrations/lesson_quiz.js');
  getTest('Lesson Resource Join Table', './database/migrations/lesson_resource.js');
});




// @todo Add the logger tests
describe('Application: Utility Functions', () => {
  getTest('Logger', './utils/logging.js');
});




describe('Application: Configuration and Setup', () => {
  // Rollback the DB before the next test block
  before(() => {
    return knex.migrate.rollback();
  });

  getTest('Validate config.js file', './application/validate.js');
  getTest('Configuration', './application/configure.js');

  // @todo Add test for app.setup
  getTest('Setup', './application/setup.js');
});




describe('Application: Client Connections', () => {
  // @todo finish the update method (either polling or observer patter)
  getTest('Client Object', './application/clients/client.js');
  getTest('WP XMLRCP Client', './application/clients/wordpress/xmlrpc.js');
});
