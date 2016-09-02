const path = require('path')
const _ = require('underscore');
const logger = require(path.resolve('lib/utils/logging.js'));



/**
  * Factory function to generate a client object
  *
  * @param {object} config - The website's cofig object
  *
  * @return {object} client - a client object
  */

function clientConstructor(config) {
  // Constants
  const __username      = config.username;
  const __password      = config.password;
  const url             = config.url;
  const apiUrl          = config.api_url;
  const updateFreq      = config.update_frequency || 30000;
  const resource_types  = config.post_types || ['post'];

  // Variables
  let __lastUpdated;
  let __connection;

  function getUsername() {
    return __username;
  }

  function getPassword() {
    return __password;
  }

  function getConnection() {
    return __connection;
  }

  function setConnection(connection) {
    if (_.isObject(connection) === false) {
      const message = 'Connection must be an object';
      logger.error(message);
      throw new Error(message);
    }
    __connection = connection;
  }

  function getLastUpdated() {
    return __lastUpdated;
  }

  function setLastUpdated() {
    __lastUpdated = Date.now();
    return __lastUpdated;
  }

  function isConnected() {
    if (getConnection() === undefined) {
      return false;
    }

    return getConnection();
  }

  function getResources(filter, fields) {
    if (isConnected() === false) {
      const message = 'Client connection is undefined. Aborting...';
      logger.error(message);
      throw new Error(message);
    }

    return __connection.fetchResources(filter, fields);
  }

  function update() {
    setInterval(getResources, updateFreq);
  }

  return {
    url: url,
    apiUrl: apiUrl,
    getUsername: getUsername,
    getPassword: getPassword,
    getConnection: getConnection,
    setConnection: setConnection,
    getLastUpdated: getLastUpdated,
    setLastUpdated: setLastUpdated,
    getResources: getResources,
    update: update
  };
}




module.exports = clientConstructor;
