const common = require('../common');
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `course_category` table exists with proper schema', () => {
  const course_category = {
    course_id: 1,
    category_id: 1
  };

  const course_id_null = {
    course_id: null,
    category_id: 1
  };

  const category_id_null = {
    course_id: 1,
    category_id: null
  };

  const course_key_nonexistent = {
    course_id: 1234,
    category_id: 1
  };

  const category_key_nonexistent = {
    course_id: 1,
    category_id: 1234
  };

  it('should insert `course_category` correctly and return the course_id', () => {
    return knex('course_category').insert(course_category)
      .then(() => {
        const result = knex('course_category').where(course_category).select('course_id');
        return expect(result).to.eventually.eql([{ course_id: 1 }]);
      });
  });

  it('should fail if `course_id` is null', () => {
    return knex('course_category').insert(course_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `category_id` is null', () => {
    return knex('course_category').insert(category_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `course_id` references a nonexistent code', () => {
    return knex('course_category').insert(course_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `category_id` references a nonexistent code', () => {
    return knex('course_category').insert(category_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

