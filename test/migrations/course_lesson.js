const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;


describe('Ensure that `course_lesson` table exists with proper schema', () => {
  const course_lesson = {
    course_id: 1,
    lesson_id: 1
  };

  const course_id_null = {
    course_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    course_id: 1,
    lesson_id: null
  };

  const course_key_nonexistent = {
    course_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    course_id: 1,
    lesson_id: 1234
  };

  it('should insert `course_lesson` correctly and return the course_id', () => {
    return knex('course_lesson').insert(course_lesson)
      .then(() => {
        const result = knex('course_lesson').where(course_lesson).select('course_id');
        return expect(result).to.eventually.eql([{ course_id: 1 }]);
      });
  });

  it('should fail if `course_id` is null', () => {
    return knex('course_lesson').insert(course_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('course_lesson').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `course_id` references a nonexistent code', () => {
    return knex('course_lesson').insert(course_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('course_lesson').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

