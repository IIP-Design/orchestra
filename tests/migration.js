const config = require('../config').database.test;
const knex = require('knex')(config);
const chai = require('chai');
const expect = chai.expect;

describe('Database Migrations', () => {
  before((done) => {
    knex.migrate.rollback(config);
    done();
  });

  beforeEach((done) => {
    return knex.migrate.latest(config).then(() => {
      // Data to be inserted before each test
    }).then(() => {
      done();
    })
  });

  afterEach((done) => {
    return knex.migrate.rollback(config).then(() => {
      done();
    });
  });
});
