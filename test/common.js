const config = require('../config').test
const knex = require('knex')(config.database);
const chai = require('chai');
const cap = require('chai-as-promised');

chai.use(cap);
const expect = chai.expect;

module.exports = {
  config: config,
  knex: knex,
  cap: cap,
  chai: chai,
  expect: expect
}
