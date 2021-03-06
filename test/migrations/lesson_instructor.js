const common = require('../common');
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `lesson_instructor` table exists with proper schema', () => {
  const lesson_instructor = {
    instructor_id: 1,
    lesson_id: 1
  };

  const instructor_id_null = {
    instructor_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    instructor_id: 1,
    lesson_id: null
  };

  const instructor_key_nonexistent = {
    instructor_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    instructor_id: 1,
    lesson_id: 1234
  };

  it('should insert `lesson_instructor` correctly and return the instructor_id', () => {
    return knex('lesson_instructor').insert(lesson_instructor)
      .then(() => {
        const result = knex('lesson_instructor').where(lesson_instructor).select('instructor_id');
        return expect(result).to.eventually.eql([{ instructor_id: 1 }]);
      });
  });

  it('should fail if `instructor_id` is null', () => {
    return knex('lesson_instructor').insert(instructor_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('lesson_instructor').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `instructor_id` references a nonexistent code', () => {
    return knex('lesson_instructor').insert(instructor_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('lesson_instructor').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

