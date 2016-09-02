const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;

describe('Ensure `glossary_term` table exists with proper schema', () => {
  const now = (new Date()).toJSON();

  const term = {
    date_created: now,
    date_modified: now,
    title: 'dog',
    description: 'A type of animal'
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    title: 'dog',
    description: 'A type of animal'
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    title: 'dog',
    description: 'A type of animal'
  };

  const title_null = {
    date_created: now,
    date_modified: now,
    title: null,
    description: 'A type of animal'
  };

  const title_ununique = {
    date_created: now,
    date_modified: now,
    title: 'dog',
    description: 'A type of animal'
  };

  const description_null = {
    date_created: now,
    date_modified: now,
    title: 'dog',
    description: null
  };

  it('should insert correctly and return the glossary term title', () => {
    return knex('glossary_term').insert(term)
      .then(() => {
        const result = knex('glossary_term').where(term).select('title');
        return expect(result).to.eventually.eql([{ title: 'dog' }]);
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('glossary_term').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('glossary_term').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('glossary_term').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is not unique', () => {
    return knex('glossary_term').insert(title_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });

  it('should fail if `description` is null', () => {
    return knex('glossary_term').insert(description_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

});
