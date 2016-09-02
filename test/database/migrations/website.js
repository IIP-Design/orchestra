const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Make sure `website` table exists with proper schema', () => {
  // Store times as JSON string for easier manipulation in JS
  const now = (new Date()).toJSON();
  const site = {
    name: 'share',
    url: 'share.america.gov',
    date_checked: now,
  };

  const name_empty = {
    url: 'share.america.gov',
    date_checked: now,
  };

  const url_empty = {
    name: 'share',
    date_checked: now,
  };

  const date_empty = {
    name: 'share',
    url: 'share.america.gov',
  };

  const url_ununique = {
    name: 'share',
    url: 'share.america.gov',
    date_checked: now,
  };

  it('should return the website name', () => {
    return knex('website').insert(site)
      .then(() => {
        const result = knex('website').where(site).select('url');
        return expect(result).to.eventually.eql([{ url: 'share.america.gov' }]);
      });
  });

  it('should fail if name is null', () => {
    return knex('website').insert(name_empty)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });

  it('should fail if url is null', () => {
    return knex('website').insert(url_empty)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });

  it('should fail if url is not unique', () => {
    return knex('website').insert(url_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });

  it('should fail if date is null', () => {
    return knex('website').insert(date_empty)
      .catch((err) => {
        expect(err.errno).to.equal(1364);
        expect(err.code).to.equal('ER_NO_DEFAULT_FOR_FIELD');
      });
  });
})
