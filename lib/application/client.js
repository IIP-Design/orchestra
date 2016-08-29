const _ = require('underscore');
const wordpress = require('wordpress');




/**
  * Extend the wordpress.Client object prototype with fetchResources method
  *
  * @param {object} settings - The settings object required by wordpress.Client
  */

function WP(settings) {
  wordpress.Client.call(this, settings);

  _.extend(WP.prototype, {
    fetchResources: () => this.authenticatedCall
  });
}




/**
  * Extend the WP object's prototype and reassign it's constructor
  *
  * @param {object} settings - The settings object required by wordpress.Clent
  * @return {object} WP - An instance of the WP object
  */

function getExtendedWpClient(settings) {
  WP.prototype = Object.create(wordpress.Client.prototype);
  WP.prototype.constructor = WP;

  return new WP(settings);
}




/**
  * Factory function to generate a client object
  *
  * @param {object} config - The website's cofig object
  * @param {object} logger - The logger
  */

function clientConstructor(config, logger) {
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

  function getResources() {
    if (isConnected() === false) {
      const message = 'Client connection is undefined. Aborting...';
      logger.error(message);
      throw new Error(message);
    }

    return __connection.fetchResources();
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




/**
  * Factory function to generate a Wordpress client object
  *
  * @param {object} config - The website's cofig object
  * @param {object} logger - The logger
  */

function wpClientConstructor(config, logger) {
  // Generate the client object
  const client = clientConstructor(config, logger);

  // Generate a Wordpress connection object
  const connection = getExtendedWpClient({
    url: client.url,
    username: client.getUsername(),
    password: client.getPassword()
  });

  // Set the Wordpress connection on the client object
  client.setConnection(connection);

  return client;
}




module.exports = wpClientConstructor;
