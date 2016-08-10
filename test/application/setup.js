const common = require('../common');
const expect = common.expect;
const config = common.config;
const setup = require('../../lib/application/setup.js');

describe('Setup the application', () => {
  it('should return a promise', () => {
    const clients = setup.setup(config);
    expect(clients).to.be.a('promise');
  });
});
