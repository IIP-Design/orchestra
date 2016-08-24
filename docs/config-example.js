/**
  * Configuration module
  * @module config
  */

module.exports = {
  /** Knexjs configuration object. See http://knexjs.org for all options. */
  production: {
    database: {
      client: "mysql",
      connection: {
        host: "127.0.0.1",
        port: "3306",
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
        directory: "/path/to/migrations",
        extension: "js",
        disableTransactions: false
      },
      seeds: {
        directory: "/path/to/seeds"
      }
    },
    websites: [
      {
        name: "website_name",
        username: "wp_username",
        password: "wp_password",
        url: "https://www.website.gov",
        api_url: "https://www.website.gov/xmlrpc.php",
        languages: ["en", "fr"],
        update_frequency: 30000,
        post_types: ["courses", "lessons", "instructors"]
      },
      {
        name: "website2",
        username: "wp_username",
        password: "wp_password",
        url: "https://www.website.gov",
        api_url: "https://www.website.gov/xmlrpc.php",
        update_frequency: 30000,
        post_types: ["post"]
      }
    ],
    logging: {
      debug_file: "/path/to/file.log",
      error_file: "/path/to/file.log"
    }
  },
  test: {
    database: {
      client: "mysql",
      connection: {
        host: "127.0.0.1",
        port: "3306",
        user: "db_username",
        password: "db_password",
        database: "db_name"
      }
    },
    websites: [
      {
        name: "website_name",
        username: "wp_username",
        password: "wp_password",
        url: "https://www.website.gov",
        api_url: "https://www.website.gov/xmlrpc.php",
        languages: ["en", "fr"],
        update_frequency: 30000,
        post_types: ["courses", "lessons", "instructors"]
      },
      {
        name: "website2",
        username: "wp_username",
        password: "wp_password",
        url: "https://www.website.gov",
        api_url: "https://www.website.gov/xmlrpc.php",
        update_frequency: 30000,
        post_types: ["post"]
      }
    ],
    logging: {
      debug_file: "/path/to/file.log",
      error_file: "/path/to/file.log"
    }
  },
  development: {
    database: {
      client: "mysql",
      connection: {
        host: "127.0.0.1",
        port: "3306",
        user: "db_username",
        password: "db_password",
        database: "db_name"
      }
    },
    websites: [
      {
        name: "website_name",
        username: "wp_username",
        password: "wp_password",
        url: "https://www.website.dev",
        api_url: "https://www.website.dev/xmlrpc.php",
        languages: ["en", "fr"],
        update_frequency: 30000,
        post_types: ["courses", "lessons", "instructors"]
      },
      {
        name: "website2",
        username: "wp_username",
        password: "wp_password",
        url: "https://www.website.dev",
        api_url: "https://www.website.dev/xmlrpc.php",
        update_frequency: 30000,
        post_types: ["post"]
      }
    ],
    logging: {
      debug_file: "/path/to/file.log",
      error_file: "/path/to/file.log"
    }
  }
}
