const wordpress = require('wordpress');

/**
  * Get the WP client objects from the configuration file
  *
  * @param {object} config - The configration object passed to the application's setup method
  * @return {array} clients - The wordpress client objects for each site from the config object
  */

function getClients(config) {
  const clients = [];

  return clients;
}


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
    const knex = require('knex')(config);

    knex.migrate.latest()
      .then(() => knex.seed.run())
      .then(() => knex.migrate.currentVersion())
      .then((version) => {
        knex.destroy();
        resolve(version);
      })
      .catch((err) => {
        knex.destroy();
        reject(err);
      });
    }),

  clients: getClients
}
