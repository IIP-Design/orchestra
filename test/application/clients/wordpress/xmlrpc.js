const path = require('path');

// Require NPM modules
const wordpress = require('wordpress');
const _ = require('underscore');
const rewire = require('rewire');

// Require from test/common.js
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;
const websites = common.config.websites;

// Require code to test
const testConfig = require(path.resolve('docs/config-example.js')).test.websites[0];
const wpxmlrpc = rewire(path.resolve('lib/application/clients/wordpress/xmlrpc.js'));

// Local global variables
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
  const getExtendedWpXmlrpcConnection = wpxmlrpc.__get__('getExtendedWpXmlrpcConnection');

  it('should return a Wordpress connection instance, WpXmlrpc', () => {
    const connection = getExtendedWpXmlrpcConnection(testConfig);
    expect(connection.constructor.name).to.equal('WpXmlrpc');
  });



  it('should include all the methods from wordpress.Client, WpXmlrpc.', () => {
    const wpClient = wordpress.createClient(testConfig);
    const wpClientMethods = _.functions(wpClient);
    const connection = getExtendedWpXmlrpcConnection(testConfig);
    const connectionMethods = _.functions(connection);
    const diff = _.difference(connectionMethods, wpClientMethods);
    expect(diff).to.eql(['constructor', 'fetchResources']);
  });



  it('should have a fetchResources method, WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(testConfig);
    const methods = _.functions(connection);
    expect(methods).to.contain('fetchResources');
  });



  it('should return a promise, WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(websites[0]);
    expect(connection.fetchResources()).to.be.a('promise');
  });



  it('should return an array of WP posts, WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(websites[0]);
    return connection.fetchResources()
      .then((result) => {
        expect(result).to.be.a('array');
        expect(result.length).to.be.above(0);
      })
  });



  it('should accept empty filter/fields objects/arrays, repsectively, WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(websites[0]);
    return connection.fetchResources({}, [])
      .then((result) => {
        expect(result).to.be.a('array');
        expect(result.length).to.be.above(0);
      })
  });



  it('should accept just a filter argument, WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(websites[0]);
    const number = 2;
    return connection.fetchResources({ number: number })
      .then((result) => {
        expect(result).to.be.a('array');
        expect(result.length).to.equal(number);
      })
  });



  it('should accept a fields array (without filter obj), WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(websites[0]);

    // the `id` key is always returned
    const keys = ['id', 'title'];
    return connection.fetchResources(['title'])
      .then((results) => {
        _.each(results, (result) => {
          expect(Object.keys(result)).to.eql(keys);
        });
      });
  });



  it('should order posts by ascending date, WpXmlrpc.fetchResources', () => {
    const connection = getExtendedWpXmlrpcConnection(websites[0]);
    const keys = ['id', 'post_date'];
    return connection.fetchResources(
        {orderby: 'date', order: 'ASC'},
        ['post_date'])
      .then((results) => {
        expect(results[0].id).to.be.below(results[1].id);
      })
  });
});




describe('- Create the client object with wpXmlrpcClientConstructor -', () => {
  const wpXmlrpcClientConstructor = wpxmlrpc.__get__('wpXmlrpcClientConstructor');

  it('should return client, with a WP connection', () => {
    const client = wpXmlrpcClientConstructor(testConfig);
    expect(client).to.have.all.keys(keys);
    expect(client.getConnection()).to.be.an.instanceof(wordpress.Client);
    expect(client.getConnection()).to.have.property('getPosts');
  });
});
