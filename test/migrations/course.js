const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;

describe('', () => {
  const now = (new Date()).toJSON();

  const course = {
    date_created: now,
    date_modified: now,
    title: 'Leadership',
    description: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    excerpt: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    featured_media: 1
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    title: 'Leadership',
    description: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    excerpt: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    featured_media: 1
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    title: 'Leadership',
    description: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    excerpt: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    featured_media: 1
  };

  const title_null = {
    date_created: now,
    date_modified: now,
    title: null,
    description: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    excerpt: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    featured_media: 1
  };

  const description_null = {
    date_created: now,
    date_modified: now,
    title: 'Leadership',
    description: null,
    excerpt: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    featured_media: 1
  };

  const excerpt_null = {
    date_created: now,
    date_modified: now,
    title: 'Leadership',
    description: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    excerpt: null,
    featured_media: 1
  };

  const featured_media_null = {
    date_created: now,
    date_modified: now,
    title: 'Leadership',
    description: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    excerpt: 'Students will explore behaviors and concepts related to a leadership topic of interest.',
    featured_media: null
  };

  it('should insert correctly and return the course title', () => {
    return knex('course').insert(course)
      .then(() => {
        const result = knex('course').where(course).select('title');
        return expect(result).to.eventually.eql([{ title: 'Leadership' }]);
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('course').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('course').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('course').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should pass if `description` is null', () => {
    return knex('course').insert(description_null)
      .then(() => {
        const result = knex('course').where(description_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Leadership' }]);
      });
  });

  it('should pass if `excerpt` is null', () => {
    return knex('course').insert(excerpt_null)
      .then(() => {
        const result = knex('course').where(excerpt_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Leadership' }]);
      });
  });

  it('should pass if `featured_media` is null', () => {
    return knex('course').insert(featured_media_null)
      .then(() => {
        const result = knex('course').where(featured_media_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Leadership' }]);
      });
  });
});
