const path = require('path');
const _ = require('underscore');
const inspector = require('schema-inspector');
const constraints = require('./validation').constraints;


/**
  * Validates that the passed config object adheres to the schema
  *
  * @param {object} config - The configuration object. See './docs/config-example.js'
  *
  * @returns {object} results - The errors, if any, found during validation.
  */

function validateConfig(config) {
  if (_.isEmpty(config)) {
    const message = 'Missing `config.js`. Put one in the project root or pass a custom location via --config at startup';
    throw new ReferenceError(message);
  }

  return inspector.validate(constraints, config);
}




/**
  * Logs and throws validation errors from the results of validate config
  *
  * @param {object} config - The configuration object. See './docs/config-example.js'
  * @param {object} logger - The logging object
  */

function logValidationErrors(config, logger) {
  // Check if the config object is valid
  const result = validateConfig(config);

  if (result.valid === false) {
    const message = result.error[0].property + ' ' + result.error[0].message;
    logger.error(message);
    throw new Error(message);
  }
}




/**
  * A series of checks on a default or specified `config.js` file, including schema validation
  *
  * @param {object} args - An args object that should include commandline-passed options, the
  *                        operating environment, and a fallback location for `config.js`
  */

function getConfig(args) {
  if (args.env === undefined) {
    throw new Error('Missing environment argument');
  }

  const cli = args.cli;
  const fallback = args.fallback;
  const env = args.env;
  let config = undefined;

  // Try assigning a value to config
  try {
    config = cli.config ? require(path.resolve(cli.config)) : require(path.resolve(fallback));
  } catch(error) {
    throw new ReferenceError('Missing `config.js`. Put one in the project root or pass a custom location via --config at startup');
  }

  // Make sure that the passed config object passes schema validation
  logValidationErrors(config, console);

  // Double check that config has the specified environment
  if (config[env] === undefined) {
    throw new Error('Your config.js file does not include the specified environment');
  }

  return config[env];
}




module.exports = {
  getConfig: getConfig
}
