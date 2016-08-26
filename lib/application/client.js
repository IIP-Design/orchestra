const _ = require('underscore');
const wordpress = require('wordpress');

function clientConstructor(config, logger) {
  // Constants
  const __username    = config.username;
  const __password    = config.password;
  const url           = config.url;
  const apiUrl        = config.api_url;
  const updateFreq    = config.update_frequency || 30000;
  const resources     = config.post_types || ['post'];

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

    __connection.fetchResources(resources)
      .then((resources) => {
        console.log('Resources:', resources);
        resolve(setLastUpdated(Date.now()));
      })
      .catch((error) => reject(error));
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




function getExtendedWpClient(settings) {
  _.extend(wordpress.Client.prototype, {
    fetchResources: (resources) => new Promise((resolve, reject) => {
      resolve(resources);
    })}
  );

  return new wordpress.Client(settings);
}




function wpClientConstructor(config, logger) {
  const client = clientConstructor(config, logger);

  const connection = getExtendedWpClient({
    url: client.url,
    username: client.getUsername(),
    password: client.getPassword()
  });

  client.setConnection(connection);

  return client;
}




module.exports = wpClientConstructor;
