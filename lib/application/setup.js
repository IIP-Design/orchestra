const _ = require('underscore');
const inspector = require('schema-inspector');
const constraints = require('../utils/validation').constraints;
const logger = require('../utils/logging');
const configure = require("./configure");


function validateConfig(config) {
  if (_.isEmpty(config)) {
    const message = 'Please include a config.js file in the orchestra project root. ' +
                    'See ./docs/config-example.js for format.';
    throw new ReferenceError(message);
  }

  return inspector.validate(constraints, config);
}


/**
  * Setup database, do any db migrations and seeding, get Wordpress client objects
  *
  * @param {object} config - The cofiguration object. See './docs/config-example.js'
  *
  * @returns {object} app - The application object
  */

module.exports = (config) => {
  return new Promise((resolve, reject) => {
    const results = validateConfig(config);

    if (results.valid === false) {
      _.each(results.error, (error) => {
        const message = error.property + ' ' + error.message;
        throw new Error(message);
      });
    }

    configure.database(config.database.production)
      .then(() => resolve(configure.clients(config)))
      .catch((err) => reject((err)));
  })
};
