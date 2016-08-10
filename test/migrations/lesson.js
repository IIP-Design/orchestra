const common = require('../common');
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `lesson` table exists with proper schema', () => {
  const now = (new Date()).toJSON();

  const lesson = {
    date_created: now,
    date_modified: now,
    title: 'How to win friends and influence people',
    description: "A lesson heavily influenced by Dale Carnegie's famous book",
    excerpt: "A lesson heavily influenced by Dale Carnegie's famous book",
    featured_media: 1
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    title: 'How to win friends and influence people',
    description: "A lesson heavily influenced by Dale Carnegie's famous book",
    excerpt: "A lesson heavily influenced by Dale Carnegie's famous book",
    featured_media: 1
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    title: 'How to win friends and influence people',
    description: "A lesson heavily influenced by Dale Carnegie's famous book",
    excerpt: "A lesson heavily influenced by Dale Carnegie's famous book",
    featured_media: 1
  };

  const title_null = {
    date_created: now,
    date_modified: now,
    title: null,
    description: "A lesson heavily influenced by Dale Carnegie's famous book",
    excerpt: "A lesson heavily influenced by Dale Carnegie's famous book",
    featured_media: 1
  };

  const description_null = {
    date_created: now,
    date_modified: now,
    title: 'How to win friends and influence people',
    description: null,
    excerpt: "A lesson heavily influenced by Dale Carnegie's famous book",
    featured_media: 1
  };

  const excerpt_null = {
    date_created: now,
    date_modified: now,
    title: 'How to win friends and influence people',
    description: "A lesson heavily influenced by Dale Carnegie's famous book",
    excerpt: null,
    featured_media: 1
  };

  const featured_media_null = {
    date_created: now,
    date_modified: now,
    title: 'How to win friends and influence people',
    description: "A lesson heavily influenced by Dale Carnegie's famous book",
    excerpt: "A lesson heavily influenced by Dale Carnegie's famous book",
    featured_media: null
  };

  it('should insert correctly and return the lesson title', () => {
    return knex('lesson').insert(lesson)
      .then(() => {
        const result = knex('lesson').where(lesson).select('title');
        return expect(result).to.eventually.eql([{ title: 'How to win friends and influence people' }]);
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('lesson').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('lesson').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('lesson').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048)
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should pass if `description` is null', () => {
    return knex('lesson').insert(description_null)
      .then(() => {
        const result = knex('lesson').where(description_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'How to win friends and influence people' }]);
      });
  });

  it('should pass if `excerpt` is null', () => {
    return knex('lesson').insert(excerpt_null)
      .then(() => {
        const result = knex('lesson').where(excerpt_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'How to win friends and influence people' }]);
      });
  });

  it('should pass if `featured_media` is null', () => {
    return knex('lesson').insert(featured_media_null)
      .then(() => {
        const result = knex('lesson').where(featured_media_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'How to win friends and influence people' }]);
      });
  });

});
