const fs = require('fs');
const rewire = require('rewire');
const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;
const logger = require('../../lib/utils/logging')(config);
const configure = require('../../lib/application/configure')(logger);
const getConfig = require('../../lib/utils/index').getConfig;


// Get `migrations` directory filenames, return most current timestamp from filename
function getCurrentMigration(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const current = newest(files);
        resolve(current);
      }
    });
  });
}


// Extract datetimes from filenames, convert to numbers, return new array
function extractDates(files) {
  const dates = files.map((file) => +(file.split('_')[0]));
  return dates;
}


// Return the newest datetime as a string
function newest(files) {
  const dates = extractDates(files);
  const newest = String(Math.max.apply(null, dates));
  return newest;
}


describe('- Test getConfig function -', () => {
  it('should fail if args.env does not exist', () => {
    const args = {
      cli: { config: './docs/config-example.js' },
      fallback: './docs/config-example.js'
    };

    expect(() => getConfig(args)).to.throw(Error, /Missing environment argument/);
  });


  it('should fail if args.env does not match an environment specified in the config.js file', () => {
    const args = {
      env: 'staging',
      cli: { config: './docs/config-example.js' },
    };

    expect(() => getConfig(args)).to.throw(Error, /Your config\.js file does not include the specified environment/);
  });


  it('should fail if no cli.config or fallback are provided', () => {
    const args = {
      cli: {},
      env: 'test',
      fallback: ''
    };

    expect(() => getConfig(args)).to.throw(ReferenceError, /Missing/);
  });


  it('should pass if either cli.config or fallback is provided', () => {
    const args = {
      cli: {},
      env: 'test',
      fallback: './docs/config-example.js'
    };

    const args2 = {
      cli: { config: 'docs/config-example.js' },
      env: 'test',
      fallback: ''
    };

    expect(() => getConfig(args)).to.not.throw(ReferenceError);
    expect(() => getConfig(args2)).to.not.throw(ReferenceError);
  });


  it('should return an environment specific configuration object', () => {
    const args = {
      cli: {},
      env: 'test',
      fallback: 'config.js'
    };

    const clone = JSON.parse(JSON.stringify(config));

    expect(getConfig(args)).to.eql(clone);
  });
});




describe('- Configure the client objects for interacting with WP - ', () => {
  it('should return an array', () => {
    const clients = configure.clients(config);
    expect(clients).to.be.a('array');
  });



  it('should return an array of client objects, whose constructor is "Client"', () => {
    const clients = configure.clients(config);
    expect(clients[0].constructor.name).to.equal('Client');
  });
});




describe('- Configure the production db -', () => {
  it('should return the current migration version', () => {
    return Promise.all([
      getCurrentMigration('lib/database/migrations'),
      configure.database(config)
    ])
    .then((result) => expect(result[0]).to.equal(result[1]));
  });


  it('should seed the database with lanaguage codes', () => {
    return configure.database(config)
      .then(() => {
        const result = knex('language').where({
          title: 'English'
        }).select('lang_code');

        expect(result).to.eventually.eql([{ lang_code: 'en' }]);
      })
  });
});

