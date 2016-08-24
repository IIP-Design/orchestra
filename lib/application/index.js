module.exports = (args) => {
  const config = args.config;
  const logger = args.logger;
  const configure = require("./configure")(logger);

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
        configure.database(config)
          .then(() => resolve(configure.clients(config)))
          .catch((err) => reject((err)));
      })
    },

    init: (clients) => {
      //console.log("init called", clients);
    }
  };
}
