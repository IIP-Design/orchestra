const common = require('./common');
const knex = common.knex;
const config = common.config;


function getTest(name, path) {
  describe(name, () => require(path));
}


// Global before block to make sure we're starting with a totally clean DB
before((done) => knex.migrate.rollback(config)
  .then(() => knex.migrate.latest(config))
  .then(() => done())
);


describe('Migrations test runner', () => {
  getTest('Website', './migrations/website.js');
  getTest('Category', './migrations/category.js');
  getTest('Tab', './migrations/tag.js');
  getTest('Language', './migrations/language.js');
  getTest('Resource Type', './migrations/resource_type.js');
  getTest('Resource', './migrations/resource.js');
  getTest('Glossary Term', './migrations/glossary_term.js');
  getTest('Media', './migrations/media.js');
  getTest('Instructor', './migrations/instructor.js');
  getTest('Lesson', './migrations/lesson.js');
  getTest('Course', './migrations/course.js');
});
