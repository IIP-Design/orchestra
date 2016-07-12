const common = require('../common');
const knex = common.knex;
const expect = common.expect;

describe('Make sure `language` table exists with proper schema', () => {
  //Run all migrations upto the most current
  beforeEach((done) => knex.migrate.latest(config)
    .then(() => knex('language').insert(language))
    .then(() => done())
    .catch((e) => console.error(e))
  );

  it('should fail', () => {
    console.log('Fail!');
  });
});
