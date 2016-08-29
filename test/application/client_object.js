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
let keys = [
  'url',
  'apiUrl',
  'getUsername',
  'getPassword',
  'getConnection',
  'setConnection',
  'getLastUpdated',
  'setLastUpdated',
  'getResources',
  'update'
];




describe('- Extend the wordpress.Client object to add a custom fetchResources method -', () => {
  const getExtendedWpConnection = clients.__get__('getExtendedWpConnection');

  it('should return a Wordpress connection instance', () => {
    const connection = getExtendedWpConnection(testConfig);
    expect(connection.constructor.name).to.equal('WP');
  });



  it('should have a fetchResources method, connection.fetchResources', () => {
    const connection = getExtendedWpConnection(testConfig);
    const methods = _.functions(connection);
    expect(methods).to.contain('fetchResources');
  });



  it('should return a promise, connection.fetchResources', () => {
    const connection = getExtendedWpConnection(testConfig);
    expect(connection.fetchResources()).to.be.a('promise');
  });
});




describe('- Create the client object with clientConstructor factory function-', () => {
  const clientConstructor = clients.__get__('clientConstructor');

  it('should pass if it returns an object, clientConstructor', () => {
    const client = clientConstructor(testConfig, console);
    expect(_.isObject(client)).to.be.true;
  });



  it('should have all of the provided keys, clientConstructor', () => {
    const client = clientConstructor(testConfig, console);
    expect(client).to.have.all.keys(keys);
  });



  it('should return the __username property, client.getUsername',() => {
    const client = clientConstructor(testConfig, console);
    expect(client.getUsername()).to.equal('wp_username');
  });



  it('should return the __password property, client.getPassword', () => {
    const client = clientConstructor(testConfig, console);
    expect(client.getPassword()).to.equal('wp_password');
  });



  it('should return an error if setConnection param is not an object, client.setConnection', () => {
    const client = clientConstructor(testConfig, console);
    const connection = true;
    expect(() => client.setConnection(connection)).to.throw(Error, /Connection must be an object/);
  });


  it('should get and set the __connection property, client.getConnection', () => {
    const client = clientConstructor(testConfig, console);
    const connection = {
      test: () => 'hi'
    };
    client.setConnection(connection);
    expect(client.getConnection()).to.eql(connection);
  });



  it('should get and set last updated, client.setLastUpdated/client.getLastUpdated', () => {
    const client = clientConstructor(testConfig, console);
    const now = Date.now();
    expect(client.setLastUpdated()).to.be.closeTo(now, 10);
    expect(client.getLastUpdated()).to.be.closeTo(now, 10);
  })



  it('should throw an error if the connection is not set, client.getResources', () => {
    const client = clientConstructor(testConfig, console);
    expect(() => client.getResources()).to.throw(Error, /Client connection is undefined/);
  });
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
