var config = require('./config');
var orchestra = require('./lib/orchestra');

// Do some checking for new configuration. Setup database, do migrations and seed if necessary
// Return app object with config stored therein
var app = orchestra.setup(config);

// daemon process started and run forever
app.init();
