const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Make sure `tag` table exists with proper schema', () => {
  const tag_empty = {};

  const tag = {
    title: 'Test tag',
  };

  const tag_parentId = {
    title: 'Test tag two',
    parent_id: 1,
  };

  const tag_noTitle = {
    parent_id: 1,
  };

  const tag_titleNull = {
    title: null,
  };

  const tag_parentIdNull = {
    title: 'Test tag three',
    parent_id: null,
  };

  it('should insert with just title', () => {
    return knex('tag').insert(tag)
      .then(() => {
        const result = knex('tag').where(tag).select('title');
        return expect(result).to.eventually.eql([{ title: tag.title }]);
      });
  });

  it('should insert with title and parent_id', () => {
    return knex('tag').insert(tag_parentId)
      .then(() => {
        const result = knex('tag').where(tag_parentId).select('title');
        return expect(result).to.eventually.eql([{ title: tag_parentId.title }]);
      });
  });

  it('should fail when empty tag inserted', () => {
    return knex('tag').insert(tag_empty)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });

  it('should fail when a tag with empty title is inserted', () => {
    return knex('tag').insert(tag_noTitle)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });

  it('should fail when the tag title is null', () => {
    return knex('tag').insert(tag_titleNull)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });
});
