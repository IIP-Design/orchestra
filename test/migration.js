const config = require('../config').database.test;
const knex = require('knex')(config);
const chai = require('chai');
const cap = require('chai-as-promised');

chai.use(cap);
const expect = chai.expect;


// Global before block to make sure we're starting with a totally clean DB
before(function(done) {
  return knex.migrate.rollback(config)
  .then(function() {
    console.log('global before block finished');
    done();
  });
});


describe('Make sure `website` table exists with proper schema', function() {

  // Store times as JSON string
  const now = (new Date()).toJSON();
  const site = {
    name: 'share',
    url: 'share.america.gov',
    date_checked: now
  }

  // Runs all migrations upto the most current
  beforeEach(function(done) {
    return knex.migrate.latest(config)
    .then(function() {
      return knex('website').insert(site);
    })
    .then(function() {
      console.log('beforeEach block finished');
      done();
    });
  });

  it('should return the website name', () => {
    return knex('website').where(site).select('url')
    .then(function(result) {
      // result = [ { url: 'share.america.gov' } ];
      expect(result[0].url).to.equal('share.america.gov');
    });
  });
});
