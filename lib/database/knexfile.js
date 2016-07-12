var database = require('../../config').database;

module.exports = {

  production: {
    client: database.production.client,
    connection: {
      database: database.production.connection.database,
      host: database.production.connection.host,
      port: database.production.connection.port,
      user: database.production.connection.user,
      password: database.production.connection.password
    },
    pool: {
      min: database.production.pool.min,
      max: database.production.pool.max
    },
    migrations: {
      tableName: database.production.migrations.tableName,
      directory: database.production.migrations.directory
    },
    seeds: {
      directory: database.production.seeds.directory
    }
  },
  test: {
    client: database.test.client,
    connection: {
      database: database.test.connection.database,
      host: database.test.connection.host,
      port: database.test.connection.port,
      user: database.test.connection.user,
      password: database.test.connection.password
    },
    pool: {
      min: database.test.pool.min,
      max: database.test.pool.max
    },
    migrations: {
      tableName: database.test.migrations.tableName,
      directory: database.test.migrations.directory
    },
    seeds: {
      directory: database.test.seeds.directory
    }
  }
};
