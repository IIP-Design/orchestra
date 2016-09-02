const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `lesson_glossary` table exists with proper schema', () => {
  const lesson_glossary = {
    term_id: 1,
    lesson_id: 1
  };

  const term_id_null = {
    term_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    term_id: 1,
    lesson_id: null
  };

  const term_key_nonexistent = {
    term_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    term_id: 1,
    lesson_id: 1234
  };

  it('should insert `lesson_glossary` correctly and return the term_id', () => {
    return knex('lesson_glossary').insert(lesson_glossary)
      .then(() => {
        const result = knex('lesson_glossary').where(lesson_glossary).select('term_id');
        return expect(result).to.eventually.eql([{ term_id: 1 }]);
      });
  });

  it('should fail if `term_id` is null', () => {
    return knex('lesson_glossary').insert(term_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('lesson_glossary').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `term_id` references a nonexistent code', () => {
    return knex('lesson_glossary').insert(term_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('lesson_glossary').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

