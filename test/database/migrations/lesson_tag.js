const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `lesson_tag` table exists with proper schema', () => {
  const lesson_tag = {
    tag_id: 1,
    lesson_id: 1
  };

  const tag_id_null = {
    tag_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    tag_id: 1,
    lesson_id: null
  };

  const tag_key_nonexistent = {
    tag_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    tag_id: 1,
    lesson_id: 1234
  };

  it('should insert `lesson_tag` correctly and return the tag_id', () => {
    return knex('lesson_tag').insert(lesson_tag)
      .then(() => {
        const result = knex('lesson_tag').where(lesson_tag).select('tag_id');
        return expect(result).to.eventually.eql([{ tag_id: 1 }]);
      });
  });

  it('should fail if `tag_id` is null', () => {
    return knex('lesson_tag').insert(tag_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('lesson_tag').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `tag_id` references a nonexistent code', () => {
    return knex('lesson_tag').insert(tag_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('lesson_tag').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

