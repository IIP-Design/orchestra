// NPM module imports
const wordpress = require('wordpress');
const _ = require('underscore');
const rewire = require('rewire');

// Project testing modules
const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const websites = common.config.websites;
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

  it('should return a Wordpress connection instance, WP', () => {
    const connection = getExtendedWpConnection(testConfig);
    expect(connection.constructor.name).to.equal('WP');
  });



  it('should include all the methods from wordpress.Client, WP.', () => {
    const wpClient = wordpress.createClient(testConfig);
    const wpClientMethods = _.functions(wpClient);
    const connection = getExtendedWpConnection(testConfig);
    const connectionMethods = _.functions(connection);
    const diff = _.difference(connectionMethods, wpClientMethods);
    expect(diff).to.eql(['constructor', 'fetchResources']);
  });



  it('should have a fetchResources method, WP.fetchResources', () => {
    const connection = getExtendedWpConnection(testConfig);
    const methods = _.functions(connection);
    expect(methods).to.contain('fetchResources');
  });



  it('should return a promise, WP.fetchResources', () => {
    const connection = getExtendedWpConnection(websites[0]);
    expect(connection.fetchResources()).to.be.a('promise');
  });



  it('should return an array of WP posts, WP.fetchResources', () => {
    const connection = getExtendedWpConnection(websites[0]);
    return connection.fetchResources()
      .then((result) => {
        expect(result).to.be.a('array');
        expect(result.length).to.be.above(0);
      })
  });



  it('should accept empty filter/fields objects/arrays, repsectively, WP.fetchResources', () => {
    const connection = getExtendedWpConnection(websites[0]);
    return connection.fetchResources({}, [])
      .then((result) => {
        expect(result).to.be.a('array');
        expect(result.length).to.be.above(0);
      })
  });



  it('should fail if the fiilter argument is not an object or array, WP.fetchResources', () => {
    const connection = getExtendedWpConnection(websites[0]);
    expect(() => connection.fetchResources('hello world')).to.throw(Error);
  });



  it('should accept just a filter argument, WP.fetchResources', () => {
    const connection = getExtendedWpConnection(websites[0]);
    return connection.fetchResources({}, [])
      .then((result) => {
        expect(result).to.be.a('array');
        expect(result.length).to.be.above(0);
      })
  });



  it('should accept only a fields array, WP.fetchResources', () => {
  });



  it('should order posts by post_modified, WP.fetchResources', () => {
  });
});




describe('- Create the client object with clientConstructor factory function -', () => {
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
