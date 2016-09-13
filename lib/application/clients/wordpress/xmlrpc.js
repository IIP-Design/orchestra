const path = require('path')
const _ = require('underscore');
const wordpress = require('wordpress');
const logger = require(path.resolve('lib/utils/logging.js'));
const clientConstructor = require(path.resolve('lib/application/clients/client.js'));




/**
  * Extend the wordpress.Client object prototype with a `fetchResources` method
  *
  * @param {object} settings - The settings object required by wordpress.Client
  */

function WpXmlrpc(settings) {

  // Get the fieldMap
  const fieldMap = wordpress.fieldMap;

  // Chain wordpress.Client constructor
  wordpress.Client.call(this, settings);

  _.extend(WpXmlrpc.prototype, {

    /**
      * A custom wp.getPosts method that works with the orchestra.Client object `getResources` interface
      *
      * @param {object} [filter] - Optional filter object.
      * @param {array} [fields] - Optional fields array.
      *
      * @return {promise|array} resources - Promise resolves an array of posts, aka 'resources'
      *
      * orchestra.Client
      * @see lib/application/client/client.js
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
      if (_.isArray(filter)) {
        fields = filter;
        filter = {};
      }

      filter = filter || {};

      if (filter.orderby) {
        filter.orderby = fieldMap.array([ filter.orderby ], "post")[0];
      }

      if (fields && _.isEmpty(fields) === false) {
        fields = fieldMap.array(fields, "post");
      }

      // `wp.getPosts` is the name of the xmlrpc method in Wordpress
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
  * Extend the WpXmlrpc object's prototype and reassign it's constructor
  *
  * @param {object} settings - The settings object required by wordpress.Clent
  * @return {object} connection - An instance of the WpXmlrpc client connection object
  */

function getExtendedWpXmlrpcConnection(settings) {
  WpXmlrpc.prototype = Object.create(wordpress.Client.prototype);
  WpXmlrpc.prototype.constructor = WpXmlrpc;

  return new WpXmlrpc(settings);
}




/**
  * Factory function to generate a Wordpress client object
  *
  * @param {object} config - The website's cofig object
  */

function wpXmlrpcClientConstructor(config) {
  if (!config) {
    const message = 'Missing config.website object';
    logger.error(message);
    throw new Error(message);
  }

  // Generate the client object
  const client = clientConstructor(config);

  // Generate a Wordpress connection object
  const connection = getExtendedWpXmlrpcConnection({
    url: client.url,
    username: client.getUsername(),
    password: client.getPassword()
  });

  // Set the Wordpress connection on the client object
  client.setConnection(connection);

  return client;
}




module.exports = wpXmlrpcClientConstructor;

