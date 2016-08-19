#!/usr/bin/env node

const args = require('commander');


// Arguments passed via the command line
args
  .version('1.0.0')
  .option('-e, --environment <env>', 'Defaults to production. Other options are "test" and "dev"')
  .option('-c, --config <path>', 'Defaults to ./config.js. See ./docs/config-example.js for an example file')
  .parse(process.argv);


// If not passed via the command line, set some reasonable defaults
const config = args.config ? require(args.config) : require('./config');
const env = args.environment ? args.environment : 'production';


// @todo: create one params object and added the config, logger, and env vars to that for easier passing arround
// const params = {
//   config: config,
//   env: env,
//   logger: logger
// }

// Create the logger and the app constants
const logger = require('./lib/utils/logging')(config);
const app = require('./lib/application/index')(config, logger, env);


// Setup and init the app
app.setup()
  .then((clients) => app.init(clients))
  .catch((error) => logger.error(error));

