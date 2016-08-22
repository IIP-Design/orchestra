#!/usr/bin/env node

const cli = require('commander');


// Arguments passed via the command line
cli
  .version('1.0.0')
  .option('-e, --environment <env>', 'Defaults to production. Other options are "test" and "dev"')
  .option('-c, --config <path>', 'Defaults to ./config.js. See ./docs/config-example.js for an example file')
  .parse(process.argv);


function getConfig() {
  // Define config outside of the try...catch block to get around block scoping limitations
  let config = undefined;

  try {
    config = cli.config ? require(cli.config) : require('./config');
  } catch(error) {
    throw new ReferenceError('Missing cofiguration file. Either place one in the project root or pass one via the command line with the --config option');
  }

  return config;
}


// If not passed via the command line, set some reasonable defaults
const config = getConfig();
const env = cli.environment ? cli.environment : 'dev';
const logger = require('./lib/utils/logging')(config);


// Create the args object passed to the app
const args = {
  config: config,
  env: env,
  logger: logger
};


// Create the app
const app = require('./lib/application/index')(args);


// Setup and init the app
app.setup()
  .then((clients) => app.init(clients))
  .catch((error) => logger.error(error));

