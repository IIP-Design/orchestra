/**
  * Configuration module
  * @module config
  */

module.exports = {
  /** Knexjs configuration object. See http://knexjs.org for all options. */
  database: {
    client: "mysql || pg || sqlite",
      connection: {
      host: "127.0.0.1",
      user: "db_username",
      password: "db_password",
      database: "db_name"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "migrations",
      directory: "./migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  },

  /** An array of website objects */
  websites: [
    {
      name: "website_name",
      username: "wp_username",
      password: "wp_password",
      url: "https://www.website.gov",
      xmlrpc: "https://www.website.gov/xmlrpc.php",
      languages: [
        "en",
        "fr",
        "fa",
        "ar",
        "pt",
        "ru",
        "zh",
        "es",
        "id"
      ],
      update_frequency: "30000",
      post_types: ["post"]
    },
    {
      name: "website_name",
      username: "wp_username",
      password: "wp_password",
      url: "https://www.website.gov",
      xmlrpc: "https://www.website.gov/xmlrpc.php",
      languages: [
        "en"
      ],
      update_frequency: "600000",
      post_types: ["post", "publication"]
    }
  ]
}
