const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Ensure `quiz` table exists with proper schema', () => {
  const now = (new Date()).toJSON();

  const quiz = {
    date_created: now,
    date_modified: now,
    question: 'What is your name',
    answer: 'Nathan Kleekamp'
  };

  const question_ununique = {
    date_created: now,
    date_modified: now,
    question: 'What is your name',
    answer: 'Nathan Kleekamp'
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    question: 'Do you by another name',
    answer: 'Nathan Kleekamp'
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    question: 'What is your nom de guerre',
    answer: 'Nathan Kleekamp'
  };

  const question_null = {
    date_created: now,
    date_modified: now,
    question: null,
    answer: 'Nathan Kleekamp'
  };

  const answer_null = {
    date_created: now,
    date_modified: now,
    question: 'What is your nom de famille',
    answer: null
  };

  it('should insert correctly and return the quiz question', () => {
    return knex('quiz').insert(quiz)
      .then(() => {
        const result = knex('quiz').where(quiz).select('question');
        return expect(result).to.eventually.eql([{ question: 'What is your name' }]);
      });
  });

  it('should fail if `question` is not unique', () => {
    return knex('quiz').insert(question_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('quiz').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('quiz').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `question` is null', () => {
    return knex('quiz').insert(question_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `answer` is null', () => {
    return knex('quiz').insert(answer_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });
});
