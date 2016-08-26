// NPM module imports
const wordpress = require('wordpress');
const _ = require('underscore');
const rewire = require('rewire');

// Project testing modules
const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config.websites;
const testConfig = require('../../docs/config-example').test.websites[0];
const clients = rewire('../../lib/application/client');

// Global variables
let keys = ['url', 'apiUrl', 'getUsername', 'getPassword', 'getConnection', 'setConnection', 'getLastUpdated', 'setLastUpdated', 'getResources', 'update'];




describe('- Create the client object with clientConstructor -', () => {
  const clientConstructor = clients.__get__('clientConstructor');

  it('should pass if it returns an object', () => {
    const client = clientConstructor(testConfig, console);
    expect(_.isObject(client)).to.be.true;
  });



  it('should have all of the provided keys', () => {
    const client = clientConstructor(testConfig, console)
    expect(client).to.have.all.keys(keys);
  });



  it('should return the username', () => {
    const client = clientConstructor(testConfig, console);
    expect(client.getUsername()).to.equal('wp_username');
  });



  it('should return the password', () => {
    const client = clientConstructor(testConfig, console);
    expect(client.getPassword()).to.equal('wp_password');
  });



  it('should return the lastUpdated', () => {
    const client = clientConstructor(testConfig, console);
    expect(client.getPassword()).to.equal('wp_password');
  });



  it('should get and set last updated', () => {
    const now = Date.now();
    const client = clientConstructor(testConfig, console);
    expect(client.setLastUpdated()).to.be.closeTo(now, 10);
    expect(client.getLastUpdated()).to.be.closeTo(now, 10);
  })
});




describe('- Create the client object with wpClientConstructor -', () => {
  const wpClientConstructor = clients.__get__('wpClientConstructor');

  it('should return client, with a WP connection', () => {
    const client = wpClientConstructor(testConfig, console);
    expect(client).to.have.all.keys(keys);
    expect(client.getConnection()).to.be.an.instanceof(wordpress.Client);
    expect(client.getConnection()).to.have.property('getPosts');
  });
});
