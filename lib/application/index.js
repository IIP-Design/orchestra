const _ = require('underscore');
const inspector = require('schema-inspector');
const constraints = require('../utils/validation').constraints;


/**
  * Validates that the passed config object adheres to the schema
  *
  * @param {object} config - The configuration object. See './docs/config-example.js'
  *
  * @returns {object} results - The errors, if any, found during validation.
  */

function validateConfig(config) {
  if (_.isEmpty(config)) {
    const message = 'Please include a config.js file in the orchestra project root. ' +
                    'See ./docs/config-example.js for format.';
    throw new ReferenceError(message);
  }

  return inspector.validate(constraints, config);
}




module.exports = (config, logger, env) => {
  // Import the configure module
  const configure = require("./configure")(logger);

  // Check if the config object is valid
  const result = validateConfig(config);

  // Fail early if the config objecgt is not valid and report the errors
  if (result.valid === false) {
    _.each(result.error, (error) => {
      const message = error.property + ' ' + error.message;
      logger.error(message);
      throw new Error(message);
    });
  }

  return {

    /**
      * Setup database, do any db migrations and seeding, get Wordpress client objects
      *
      * @param {object} config - The cofiguration object. See './docs/config-example.js'
      *
      * @returns {object} app - The application object
      */

    setup: () => {
      return new Promise((resolve, reject) => {
        configure.database(config.database[env])
          .then(() => resolve(configure.clients(config)))
          .catch((err) => reject((err)));
      })
    },

    init: (clients) => {
      //console.log("init called", clients);
    }
  };
}
