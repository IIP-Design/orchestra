const configure = require("./configure");

module.exports = {
  /**
    * Setup database, do any db migrations and seeding, get Wordpress client objects
    *
    * @param {object} config - The cofiguration object. See './docs/config-example.js'
    *
    * @returns {object} app - The application object
    */
  setup: (config) => new Promise((resolve, reject) => {
    configure.database(config.database.production)
      .then(() => resolve(configure.clients(config)))
      .catch((err) => reject((err)));
  })
};
