const setup = require("./setup").setup;

module.exports = {
  setup: setup,
  init: (clients) => {
    console.log("init called", clients);
  }
}
