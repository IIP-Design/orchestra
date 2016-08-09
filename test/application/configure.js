const fs = require('fs');
const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;
const configure = require('../../lib/application/configure.js');


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


describe('Configure the application', () => {
  it('should return an array of client objects', () => {
    const clients = configure.clients(config);
    expect(clients).to.be.a('array');
  });
});


describe('Configure the production db', () => {
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
          lang_code: 'en',
          title: 'English'
        }).select('id');

        expect(result).to.eventually.eql([{ id: 222 }]);
      })
  });
});

