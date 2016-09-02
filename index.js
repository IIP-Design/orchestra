#!/usr/bin/env node

const path = require('path');
const cli = require('commander');
const getConfig = require(path.resolve('lib/utils/helpers.js')).getConfig;


// Arguments passed via the command line
cli
  .version('1.0.0')
  .option('-c, --config <file>', 'Defaults to `config.js` in project root. See docs/config-example.js for an example')
  .option('-e, --environment <env>', 'Defaults to production. Other options are "test" and "dev"')
  .parse(process.argv);


// If not passed via the command line, set some reasonable defaults
const env = cli.environment ? cli.environment : 'development';
const config = getConfig({ cli: cli, env: env, fallback: 'config.js' });


// Set global variable for logger
global.debug_file = config.logging.debug_file
global.error_file = config.logging.error_file


// Require logger
const logger = require(path.resolve('lib/utils/logging.js'));


// Create the app
const app = require(path.resolve('lib/application/index'))(config);


// Setup and init the app
app.setup()
  .then((clients) => app.init(clients))
  .catch((error) => logger.error(error));

