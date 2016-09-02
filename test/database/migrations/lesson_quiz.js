const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `lesson_quiz` table exists with proper schema', () => {
  const lesson_quiz = {
    quiz_id: 1,
    lesson_id: 1
  };

  const quiz_id_null = {
    quiz_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    quiz_id: 1,
    lesson_id: null
  };

  const quiz_key_nonexistent = {
    quiz_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    quiz_id: 1,
    lesson_id: 1234
  };

  it('should insert `lesson_quiz` correctly and return the quiz_id', () => {
    return knex('lesson_quiz').insert(lesson_quiz)
      .then(() => {
        const result = knex('lesson_quiz').where(lesson_quiz).select('quiz_id');
        return expect(result).to.eventually.eql([{ quiz_id: 1 }]);
      });
  });

  it('should fail if `quiz_id` is null', () => {
    return knex('lesson_quiz').insert(quiz_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('lesson_quiz').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `quiz_id` references a nonexistent code', () => {
    return knex('lesson_quiz').insert(quiz_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('lesson_quiz').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

