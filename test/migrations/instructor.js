const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;

describe('Ensure `instructor` table exists with proper schema', () => {
  const now = (new Date()).toJSON();

  const instructor = {
    date_created: now,
    date_modified: now,
    title: 'Nathan Kleekamp',
    description: 'A developer in the Office of Design',
    featured_media: 1
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    title: 'Nathan Kleekamp',
    description: 'A developer in the Office of Design',
    featured_media: 1
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    title: 'Nathan Kleekamp',
    description: 'A developer in the Office of Design',
    featured_media: 1
  };

  const title_null = {
    date_created: now,
    date_modified: now,
    title: null,
    description: 'A developer in the Office of Design',
    featured_media: 1
  };

  const description_null = {
    date_created: now,
    date_modified: now,
    title: 'Nathan Kleekamp',
    description: null,
    featured_media: 1
  };

  const featured_media_null = {
    date_created: now,
    date_modified: now,
    title: 'Nathan Kleekamp',
    description: 'A developer in the Office of Design',
    featured_media: null
  };

  it('should insert correctly and return the instructor title', () => {
    return knex('instructor').insert(instructor)
      .then(() => {
        const result = knex('instructor').where(instructor).select('title');
        return expect(result).to.eventually.eql([{ title: 'Nathan Kleekamp' }]);
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('instructor').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('instructor').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('instructor').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should pass if `description` is null', () => {
    return knex('instructor').insert(description_null)
      .then(() => {
        const result = knex('instructor').where(description_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Nathan Kleekamp' }]);
      });
  });

  it('should pass if `featured_media` is null', () => {
    return knex('instructor').insert(featured_media_null)
      .then(() => {
        const result = knex('instructor').where(featured_media_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Nathan Kleekamp' }]);
      });
  });
});
