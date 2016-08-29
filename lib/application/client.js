const _ = require('underscore');
const wordpress = require('wordpress');


/**
  * Extend the wordpress.Client object prototype with a `fetchResources` method
  *
  * @param {object} settings - The settings object required by wordpress.Client
  */

function WP(settings) {

  // Get the fieldMap
  const fieldMap = wordpress.fieldMap;

  // Chain wordpress.Client constructor
  wordpress.Client.call(this, settings);

  _.extend(WP.prototype, {

    /**
      * A custom wp.getPosts method that works with Client object `getResources` method
      *
      * @param {object} [filter] - Optional filter object.
      * @param {object} [fields] - Optional fields object.
      *
      * @return {promise|array} resources - Promise resolves an array of posts, aka 'resources'
      *
      * wp.Posts
      * @see https://codex.wordpress.org/XML-RPC_WordPress_API/Posts
      *
      * Filters:
      * @see https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#Parameters_2
      *
      * Fields:
      * @see: https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPost
      */

    fetchResources: (filter, fields) => new Promise((resolve, reject) => {
      var filter = filter || {};
      var fields = fields || null;

      if (filter.orderby) {
        filter.orderby = fieldMap.array([ filter.orderby ], "post")[0];
      }

      if (fields) {
        fields = fieldMap.array(fields, "post");
      }

      this.authenticatedCall("wp.getPosts", filter, fields, (error, posts) => {
        if (error) {
          reject(error);
        }

        const resources = posts.map((post) => fieldMap.from(post, "post"));
        resolve(resources);
      });
    })
  });
}




/**
  * Extend the WP object's prototype and reassign it's constructor
  *
  * @param {object} settings - The settings object required by wordpress.Clent
  * @return {object} connection - An instance of the WP client connection object
  */

function getExtendedWpConnection(settings) {
  WP.prototype = Object.create(wordpress.Client.prototype);
  WP.prototype.constructor = WP;

  return new WP(settings);
}




/**
  * Factory function to generate a client object
  *
  * @param {object} config - The website's cofig object
  * @param {object} logger - The logger
  *
  * @return {object} client - a client object
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

  function getResources(filter, fields, fn) {
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
  const connection = getExtendedWpConnection({
    url: client.url,
    username: client.getUsername(),
    password: client.getPassword()
  });

  // Set the Wordpress connection on the client object
  client.setConnection(connection);

  return client;
}




module.exports = wpClientConstructor;
