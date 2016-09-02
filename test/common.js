const path = require('path');
const config = require(path.resolve('config.js')).test
const knex = require('knex')(config.database);
const chai = require('chai');
const cap = require('chai-as-promised');

chai.use(cap);
const expect = chai.expect;


// Set global logging files
global.debug_file = config.logging.debug_file;
global.error_file = config.logging.error_file;


module.exports = {
  config: config,
  knex: knex,
  cap: cap,
  chai: chai,
  expect: expect
}
