const common = require('../common');
const knex = common.knex;
const expect = common.expect;


describe('Make sure `category` table exists with proper schema', () => {
  const category_empty = {};

  const category = {
    title: 'Test category',
  };

  const category_parentId = {
    title: 'Test category two',
    parent_id: 1,
  };

  const category_noTitle = {
    parent_id: 1,
  };

  const category_titleNull = {
    title: null,
    parent_id: 1,
  };


  it('should insert with just title', () => {
    return knex('category').insert(category)
      .then(() => {
        const result = knex('category').where(category).select('title');
        return expect(result).to.eventually.eql([{ title: category.title }]);
      });
  });

  it('should insert with title and parent_id', () => {
    return knex('category').insert(category_parentId)
      .then(() => {
        const result = knex('category').where(category_parentId).select('title');
        return expect(result).to.eventually.eql([{ title: category_parentId.title }]);
      });
  });

  it('should fail when empty category inserted', () => {
    return knex('category').insert(category_empty)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });

  it('should fail when a category with empty title is inserted', () => {
    return knex('category').insert(category_noTitle)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });

  it('should fail when the category title is null', () => {
    return knex('category').insert(category_titleNull)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });
});
