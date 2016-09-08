const path = require('path')
const _ = require('underscore');
const logger = require(path.resolve('lib/utils/logging.js'));




/**
  * Factory function to generate a client object
  *
  * @param {object} config - The website's cofig object
  *
  * @returns {object} client - a client object
  *
  * @function
  * @namespace clientConstrutor
  */

function clientConstructor(config) {

  /**
    * The website's url
    *
    * @property {string} url - The website's url
    *
    * @memberof clientConstructor
    */

  const url = config.url;


  /**
    * The username the client should connect with, if necessary
    *
    * @property {string} __username - The username the client should connect with, if necessary
    *
    * @memberof clientConstructor
    * @private
    *
    * @see clientConstructor.getUsername()
    */

  const __username = config.username;


  /**
    * The password the client should connect with, if necessary
    *
    * @property {string} __password - The password the client should connect with, if necessary
    *
    * @memberof clientConstructor
    * @private
    *
    * @see clientConstructor.getPassword()
    */

  const __password = config.password;


  /**
    * The frequency the client should be checked for changes
    *
    * @property {number} __updateFreq - The frequency the client should be checked for changes
    *
    * @memberof clientConstructor
    * @private
    */

  const __updateFreq = config.update_frequency || 30000;

  /**
    * @property {array} __resource_types - The types of resources that should be queried
    *
    * @memberof clientConstructor
    * @private
    */

  const __resource_types = config.post_types || ['post'];


  /**
    * The properties/methods that are required on the connection object
    *
    * @property {array} __requiredConnectionProperties - The properties/methods that are required on the connection object
    *
    * @memberof clientConstructor
    * @private
    */

  const __requiredConnectionProperties = ['fetchResources'];


  /**
    * The last time the client was last checked
    *
    * @property {number} __lastUpdated - Milliseconds since the Unix epoch
    * @defualt undefined
    *
    * @memberof clientConstructor
    * @private
    *
    * @see clientConstructor.getLastUpdated()
    * @see clientConstructor.setLastUpdated()
    */

  let __lastUpdated;


  /**
    * The connection object
    *
    * @property {object} Connection - A connection object
    * @defualt undefined
    *
    * @memberof clientConstructor
    * @private
    *
    * @see clientConstructor.setConnection()
    * @see clientConstructor.__validateConnection()
    */

  let __connection;


  /**
    * Check if there's a connection object assigned to __connection
    *
    * @returns {boolean|object} False if no connection, otherwise, the connection object
    *
    * @memberof clientConstructor
    * @private
    * @method
    *
    * @see clientConstructor.__getConnection()
    */

  function __isConnected() {
    if (__getConnection() === undefined) {
      return false;
    }

    return __getConnection();
  }


  /**
    * Validate the passed connection object to make sure it is
    *   1) an object, and
    *   2) has all the required properties
    *
    * @param {object} connection - The connection object to query the API, for example Wordpress's XMLRPC api
    *
    * @returns {object} results - The results object
    * @returns {boolean} results.valid - Defaults to true
    * @returns {string} result.error - Error message. Defaults to undefined
    *
    * @memberof clientConstructor
    * @private
    * @method
    *
    * @see clientConstructor.__requiredConnectionProperties
    * @see clientConstructor.__setConnection()
    */

  function __validateConnection(connection) {
    const connectionProperties = _.allKeys(connection);

    // Get the common properties
    const intersect = _.intersection(__requiredConnectionProperties, connectionProperties);

    // Get the different properties
    const diff = _.difference(__requiredConnectionProperties, connectionProperties);

    // Set reasonable defaults
    const results = {
      valid: true,
      error: undefined
    };

    if (_.isObject(connection) === false) {
      results.valid = false;
      results.error = 'Connection must be an object';

      return results;
    }

    // Make sure connection has requird properties
    if (intersect.length !== __requiredConnectionProperties.length) {
      results.valid = false;
      results.error = 'Connection object is missing required properties: ' + diff;

      return results;
    }

    return results;
  }


  /**
    * Getter for __connection
    *
    * @returns {object} __connection - The connection object
    *
    * @memberof clientConstructor
    * @private
    * @method
    *
    * @see clientConstructor.__connection
    */

  function __getConnection() {
    return __connection;
  }


  /**
    * Setter for __connection
    *   1) Ensure a connection is not already present, and
    *   2) Ensure the connection is valid
    *
    * @param {object} connection - The connection object
    *
    * @memberof clientConstructor
    * @method
    *
    * @see clientConstructor.__connection
    * @see clientConstructor.__getConnection()
    * @see clientConstructor.__validateConnection()
    */

  function setConnection(connection) {
    if (_.isObject(__getConnection()) === true) {
      const message = 'Connection has already been set';
      logger.error(message);
      throw new Error(message);
    }

    const results = __validateConnection(connection);

    if (results.valid === false) {
      logger.error(results.error);
      throw new Error(results.error);
    }

    // Finally set it
    __connection = connection;
  }


  /**
    * Getter for __username
    *
    * @returns {string} __username
    *
    * @memberof clientConstructor
    * @method
    *
    * @see __username
    */

  function getUsername() {
    return __username;
  }


  /**
    * Getter for __password
    *
    * @returns {string} __password
    *
    * @memberof clientConstructor
    * @method
    *
    * @see __password
    */

  function getPassword() {
    return __password;
  }


  /**
    * Getter for __lastUpdated
    *
    * @returns {number} __lastUpdated
    *
    * @memberof clientConstructor
    * @method
    *
    * @see __lastUpdated
    */

  function getLastUpdated() {
    return __lastUpdated;
  }


  /**
    * Setter for __lastUpdated
    *
    * @returns {number} __lastUpdated
    *
    * @memberof clientConstructor
    * @method
    *
    * @see __lastUpdated
    */

  function setLastUpdated() {
    __lastUpdated = Date.now();
    return __lastUpdated;
  }


  /**
    * A common interface for getting resources from different connection types
    *
    * @todo Finish implementation and tests
    *
    * @memberof clientConstructor
    * @method
    *
    * @see clientConstructor.__isConnected()
    * @see clientConstructor.__requiredConnectionProperties
    */

  function getResources(filter, fields) {
    if (__isConnected() === false) {
      const message = 'Client connection is undefined. Aborting...';
      logger.error(message);
      throw new Error(message);
    }

    const result = __connection.fetchResources(filter, fields)

    setLastUpdated();

    return result;
  }


  /**
    * Check the client for new content according to __updateFreq
    *
    * @todo Finish implementation and tests
    *
    * @memberof clientConstructor
    * @method
    *
    * @see clientConstructor.__updateFreq
    * @see clientConstructor.getResources()
    */

  function update() {
    setInterval(getResources, __updateFreq);
  }

  return {
    url: url,
    getUsername: getUsername,
    getPassword: getPassword,
    setConnection: setConnection,
    getLastUpdated: getLastUpdated,
    setLastUpdated: setLastUpdated,
    getResources: getResources,
    update: update
  };
}




module.exports = clientConstructor;
