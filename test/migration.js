const config = require('../config').database.test;
const knex = require('knex')(config);
const chai = require('chai');
const cap = require('chai-as-promised');

chai.use(cap);
const expect = chai.expect;


// Global before block to make sure we're starting with a totally clean DB
before((done) => knex.migrate.rollback(config)
  .then(() => done())
);


describe('Make sure `website` table exists with proper schema', () => {
  // Store times as JSON string for easier manipulation in JS
  const now = (new Date()).toJSON();
  const site = {
    name: 'share',
    url: 'share.america.gov',
    date_checked: now,
  };

  // Runs all migrations upto the most current
  beforeEach((done) => knex.migrate.latest(config)
    .then(() => knex('website').insert(site))
    .then(() => done())
  );

  it('should return the website name', () => {
    const result = knex('website').where(site).select('url');
    return expect(result).to.eventually.eql([{ url: 'share.america.gov' }]);
  });
});
