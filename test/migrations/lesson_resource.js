const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;


describe('Ensure that `lesson_resource` table exists with proper schema', () => {
  const lesson_resource = {
    resource_id: 1,
    lesson_id: 1
  };

  const resource_id_null = {
    resource_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    resource_id: 1,
    lesson_id: null
  };

  const resource_key_nonexistent = {
    resource_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    resource_id: 1,
    lesson_id: 1234
  };

  it('should insert `lesson_resource` correctly and return the resource_id', () => {
    return knex('lesson_resource').insert(lesson_resource)
      .then(() => {
        const result = knex('lesson_resource').where(lesson_resource).select('resource_id');
        return expect(result).to.eventually.eql([{ resource_id: 1 }]);
      });
  });

  it('should fail if `resource_id` is null', () => {
    return knex('lesson_resource').insert(resource_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('lesson_resource').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `resource_id` references a nonexistent code', () => {
    return knex('lesson_resource').insert(resource_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('lesson_resource').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

