const wordpress = require('wordpress');

function clientConstructor(args) {
  // Constants
  const config        = args.config;
  const logger        = args.logger;
  const __username    = config.username;
  const __password    = config.password;
  const url           = config.url;
  const apiUrl        = config.api_url;
  const updateFreq    = config.update_frequency || 30000;
  const resources     = config.post_types || ['post'];

  // Variables
  let __lastUpdated;
  let connection;

  function isConnected() {
    if (connection === undefined) {
      return false;
    }

    return connection;
  }

  function getUsername() {
    return __username;
  }

  function getPassword() {
    return __password;
  }

  function getLastUpdated() {
    return __lastUpdated;
  }

  function setLastUpdated() {
    __lastUpdated = Date.now();
    return __lastUpdated;
  }

  function update() {
    if (isConnected() === false) {
      const message = 'Client connection is undefined. Aborting...';
      logger.error(message);
      throw new Error(message);
    }

    setInterval(connection.getResources, updateFreq);
  }

  return {
    url: url,
    apiUrl: apiUrl,
    isConnected: isConnected,
    getUsername: getUsername,
    getPassword: getPassword,
    getLastUpdated: getLastUpdated,
    setLastUpdated: setLastUpdated,
    update: update
  };
}




// function getWpResources(args) {
//   const clients   = args.client;
//   const logger    = args.logger;
//   const filter    = args.filter;
//   const fields    = args.field;
//   const callback  = args.callback;
// 
//   return new Promise((resolve, reject) => {
//     client.connection.getPosts(filter, fields, (error, data) => {
//       if (error) {
//         reject(throw new Error(error));
//       }
// 
//       if (callback) {
//         resolve(callback(filter, fields, data));
//       } else {
//         resolve(logger.info(data));
//       }
//     });
//   });
// }




function wpClientConstructor(config) {
  const client = clientConstructor(config);

  const connection = wordpress.createClient({
    url: client.url,
    username: client.getUsername(),
    password: client.getPassword()
  });

  client.connection = connection;
  client.connection.getResources = getWpResources;

  return client;
}




module.exports = wpClientConstructor;
