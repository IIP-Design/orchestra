const config = require('./config');
const logger = require('./lib/utils/logging');
const app = require('./lib/application/index');

app.setup(config)
  .then((clients) => app.init(clients))
  .catch((error) => logger.error(error));
