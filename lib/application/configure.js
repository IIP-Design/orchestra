const path = require('path');
const _ = require('underscore');
const wordpress = require('wordpress');
const logger = require(path.resolve('lib/utils/logging.js'));

module.exports = {
  /**
    * Does the following:
    *
    * 1. Creates a Knex connection to the database
    * 2. Performs latest DB migration
    * 3. Returns current migration version number
    * 4. Destroys the connection to the DB when finished
    *
    * @param {object} - A knex configuration object. See http://knexjs.org/#Installation-client
    * @return {promise|string} - A datestring in '20160506091822' format
    */

  database: (config) => new Promise((resolve, reject) => {
    const knex = require('knex')(config.database);

    database: (config) => {
      const knex = require('knex')(config.database);

      return knex.migrate.latest()
        .then(() => {
          logger.info("knex.migrate.latest() complete. Seeding DB...");
          knex.seed.run();
          logger.info("knex.seed.run() complete.");
        })
        .then(() => knex.migrate.currentVersion())
        .then((version) => {
          logger.info("Current DB migration version:", version, "Destroying Knex DB connection...");
          knex.destroy();
          return version;
        })
        .catch((err) => {
          knex.destroy();
          return err;
        });
      },


  /**
    * Get the WP client objects from the configuration file
    *
    * @param {object} config - The configration object passed to the application's setup method
    * @return {array} clients - The wordpress client objects for each site from the config object
    */

  clients: (config) => {
    const clients = [];
    const websites = config.websites;

    _.each(websites, (website) => {

      try {
        const client = wordpress.createClient({
          url: website.url,
          username: website.username,
          password: website.password,
        });

        logger.info("WP client created: ", website.url);

        clients.push(client);
      } catch (error) {
        logger.error(error);
      }
    });

    return clients;
  }
}
