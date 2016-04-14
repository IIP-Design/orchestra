var database = require('../../config').database;

module.exports = {
  production: {
    client: database.production.client,
    connection: database.production.connection,
    pool: database.production.pool,
    migrations: database.production.migrations,
    seeds: database.production.seeds
  },
  test: {
    client: database.test.client,
    connection: database.test.connection,
    pool: database.test.pool,
    migrations: database.test.migrations,
    seeds: database.test.seeds
  }
};
