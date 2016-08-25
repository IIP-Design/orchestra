const wordpress = require('wordpress');
const _ = require('underscore');
const rewire = require('rewire');
const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config.websites;
const testConfig = require('../../docs/config-example').test.websites;
const clients = rewire('../../lib/application/client');


describe('- Create the client object -', () => {
  const clientConstructor = clients.__get__('clientConstructor');
  const wpClientConstructor = clients.__get__('wpClientConstructor');
  const getWpResources = clients.__get__('getWpResources');
  const args = { config: testConfig[0], logger: console };
  let keys = ['url', 'apiUrl', 'isConnected', 'getUsername', 'getPassword', 'getLastUpdated', 'setLastUpdated', 'update'];

  it('should pass if it returns an object', () => {
    const test = clientConstructor(args);
    expect(_.isObject(test)).to.be.true;
  });



  it('should have all of the provided keys', () => {
    const test = clientConstructor(args)
    expect(test).to.have.all.keys(keys);
  });



  it('should return false if it does not have a connection object', () => {
    const test = clientConstructor(args);
    expect(test.isConnected()).to.be.false;
  });



  it('should return the username', () => {
    const test = clientConstructor(args);
    expect(test.getUsername()).to.equal('wp_username');
  });



  it('should return the password', () => {
    const test = clientConstructor(args);
    expect(test.getPassword()).to.equal('wp_password');
  });



  it('should return the lastUpdated', () => {
    const test = clientConstructor(args);
    expect(test.getPassword()).to.equal('wp_password');
  });



  it('should get and set last updated', () => {
    const now = Date.now();
    const test = clientConstructor(args);
    expect(test.setLastUpdated()).to.be.closeTo(now, 10);
    expect(test.getLastUpdated()).to.be.closeTo(now, 10);
  })



  it('should throw an error if there if client.connection is undefined', () => {
    const test = clientConstructor(args);
    expect(() => test.update()).to.throw(Error);
  });



  it('should return client, with a WP connection', () => {
    const test = wpClientConstructor(args);
    keys.push('connection');
    expect(test).to.have.all.keys(keys);
    expect(test.connection).to.be.an.instanceof(wordpress.Client);
    expect(test.connection).to.have.property('getPosts');
    expect(test.connection).to.have.ownProperty('getResources');
  });



  it('should return a promise', () => {
    const test = getWpResources(args);
  });
});
