const path = require('path');
const logger = require(path.resolve('lib/utils/logging.js'));
const configure = require(path.resolve('lib/application/configure.js'));


module.exports = (config) => {
  return {
    /**
      * Setup database, do any db migrations and seeding, get Wordpress client objects
      *
      * @param {object} config - The cofiguration object. See './docs/config-example.js'
      *
      * @returns {object} app - The application object
      */

    setup: () => configure.database(config)
          .then(configure.clients(config))
          .catch((err) => err),

    init: (clients) => {
      //console.log("init called", clients);
    }
  }
};
