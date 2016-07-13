const common = require('../common');
const knex = common.knex;
const expect = common.expect;

describe('Ensure `resource_type` table exists with proper schema', () => {
  const resource_type = {
    title: 'book'
  };

  const resource_type_null = {
    title: null
  };

  const resource_type_ununique = {
    title: 'book'
  }

  it('should insert resource type correctly', () => {
    return knex('resource_type').insert(resource_type)
      .then(() => {
        const result = knex('resource_type').where(resource_type).select('title');
        return expect(result).to.eventually.eql([{ title: 'book' }]);
      });
  });

  it('should fail when `resource_type` is null', () => {
    return knex('resource_type').insert(resource_type_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail when `resource_type` is not unique', () => {
    return knex('resource_type').insert(resource_type_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });
});
