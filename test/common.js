const config = require('../config')
const knex = require('knex')(config.database.test);
const chai = require('chai');
const cap = require('chai-as-promised');

chai.use(cap);
const expect = chai.expect;

exports.config = config;
exports.knex = knex;
exports.cap = cap;
exports.chai = chai;
exports.expect = expect;
