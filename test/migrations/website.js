const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;


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
    .catch((e) => console.error(e))
  );

  it('should return the website name', () => {
    const result = knex('website').where(site).select('url');
    return expect(result).to.eventually.eql([{ url: 'share.america.gov' }]);
  });
});
