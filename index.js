#!/usr/bin/env node

const cli = require('commander');
const getConfig = require('./lib/utils/index').getConfig;


// Arguments passed via the command line
cli
  .version('1.0.0')
  .option('-e, --environment <env>', 'Defaults to production. Other options are "test" and "dev"')
  .option('-c, --config <file>', 'Defaults to `config.js` in project root. See docs/config-example.js for an example')
  .parse(process.argv);


// If not passed via the command line, set some reasonable defaults
const env = cli.environment ? cli.environment : 'development';
const config = getConfig({ cli: cli, env: env, fallback: 'config.js' });
const logger = require('./lib/utils/logging')(config);


// Create the app
const app = require('./lib/application/index')({ config: config, logger: logger });


// Setup and init the app
app.setup()
  .then((clients) => app.init(clients))
  .catch((error) => logger.error(error));

