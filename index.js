const config = require('./config');
const app = require('./lib/application/index');

app.setup(config)
  .then((clients) => app.init(clients))
  .catch((err) => console.error(err.stack));
