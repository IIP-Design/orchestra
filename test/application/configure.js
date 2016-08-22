const fs = require('fs');
const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;
const logger = require('../../lib/utils/logging')(config);
const configure = require('../../lib/application/configure')(logger);


// Helper functions


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


describe('Configure the client objects for interacting with WP: ', () => {
  it('should return an array', () => {
    const clients = configure.clients(config);
    expect(clients).to.be.a('array');
  });

  it('should return an array of client objects, whose constructor is "Client"', () => {
    const clients = configure.clients(config);
    expect(clients[0].constructor.name).to.equal('Client');
  });
});


describe('Configure the production db', () => {
  it('should return the current migration version', () => {
    return Promise.all([
      getCurrentMigration('lib/database/migrations'),
      configure.database(config.database.test)
    ])
    .then((result) => expect(result[0]).to.equal(result[1]));
  });

  it('should seed the database with lanaguage codes', () => {
    return configure.database(config.database.test)
      .then(() => {
        const result = knex('language').where({
          title: 'English'
        }).select('lang_code');

        expect(result).to.eventually.eql([{ lang_code: 'en' }]);
      })
  });
});

