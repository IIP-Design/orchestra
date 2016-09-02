const path = require('path');
const logger = require(path.resolve('lib/utils/logging.js'));
const wpXmlrpcClientConstructor = require(path.resolve('wordpress/xmlrpc.js'));

module.exports = {
  wpXmlrpcClientConstructor: wpXmlrpcClientConstructor
}

