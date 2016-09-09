const path = require('path');

// Require NPM modules
const _ = require('underscore');

// Require from test/common.js
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;
const websites = common.config.websites;

// Require code to test
const clientConstructor = require(path.resolve('lib/application/clients/client.js'));
const testConfig = require(path.resolve('docs/config-example.js')).test.websites[0];

// Local global variables
let keys = [
  'url',
  'getUsername',
  'getPassword',
  'setConnection',
  'getLastUpdated',
  'setLastUpdated',
  'getResources',
  'update'
];




describe('- Create the client object with clientConstructor factory function -', () => {

  it('should pass if it returns an object, clientConstructor', () => {
    const client = clientConstructor(testConfig);
    expect(_.isObject(client)).to.be.true;
  });



  it('should have all of the provided keys, clientConstructor', () => {
    const client = clientConstructor(testConfig);
    expect(client).to.have.all.keys(keys);
  });



  it('should return the __username property, client.getUsername',() => {
    const client = clientConstructor(testConfig);
    expect(client.getUsername()).to.equal('wp_username');
  });



  it('should return the __password property, client.getPassword', () => {
    const client = clientConstructor(testConfig);
    expect(client.getPassword()).to.equal('wp_password');
  });



  it('should throw an error if setConnection param is not an object, client.setConnection', () => {
    const client = clientConstructor(testConfig);
    const connection = true;
    expect(() => client.setConnection(connection)).to.throw(Error, /Connection must be an object/);
  });



  it('should throw an error if setConnection object does not have the required properties, client.setConnection', () => {
    const client = clientConstructor(testConfig);
    const connection = {}
    expect(() => client.setConnection(connection)).to.throw(Error, /(Connection object is missing required properties)/);
  });



  it('should throw an error if the a __connection has already been set, client.setConnection', () => {
    const client = clientConstructor(testConfig);
    const connection = {
      fetchResources: () => 'test'
    };
    const connection2 = {
      fetchResources: () => 'test'
    };
    expect(() => {
      client.setConnection(connection);
      client.setConnection(connection2);
    }).to.throw(Error, /Connection has already been set/);
  });



  it('should get and set last updated, client.setLastUpdated/client.getLastUpdated', () => {
    const client = clientConstructor(testConfig);
    const now = Date.now();
    expect(client.getLastUpdated()).to.equal(undefined);
    expect(client.setLastUpdated()).to.be.closeTo(now, 10);
    expect(client.getLastUpdated()).to.be.closeTo(now, 10);
  });



  it('should throw an error if the connection is not set, client.getResources', () => {
    const client = clientConstructor(testConfig);
    expect(() => client.getResources()).to.throw(Error, /Client connection is undefined/);
  });



  it('should always return a promise, regardless of whether or not connection.fetchResources is a promise, client.getResources', () => {
    const client = clientConstructor(testConfig);
    const resources = ['Fetched resources'];
    const connection = {
      fetchResources: (filter, fields) => {
        fields = fields || [];
        filter = filter || {};

        return resources;
      }
    };
    client.setConnection(connection);
    expect(client.getResources()).to.be.a('promise');
  });



  it('should return a list of resources from the given connection and set last updated, client.getResources', () => {
    const client = clientConstructor(testConfig);
    const resources = ['Fetched resources'];
    const connection = {
      fetchResources: (filter, fields) => new Promise((resolve, reject) => {
        fields = fields || [];
        filter = filter || {};

        resolve(resources);
      })
    };
    client.setConnection(connection);
    return client.getResources().then((results) => {
      let now = Date.now();
      let lastUpdated = client.getLastUpdated();
      expect(results).to.equal(resources);
      expect(lastUpdated).to.be.closeTo(now, 10);
    });
  });
});

