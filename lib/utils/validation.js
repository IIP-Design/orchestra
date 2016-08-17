const sanitization = {};

const constraints = {
  type: 'object',
  properties: {
    database: {
      optional: false,
      type: 'object',
      properties: {
        production: {
          type: 'object',
          optional: false,
          properties: {
            client: {
              type: 'string',
              optional: false,
              eq: ['mysql', 'mysql2', 'mariasql'],
              error: 'Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"'
            },
            connection: {
              type: 'object',
              properties: {
                host: {
                  type: 'string',
                  optional: false,
                  error: 'Must provide a database host ip'
                },
                port: {
                  type: 'string',
                  optional: true,
                },
                user: {
                  type: 'string',
                  optional: false,
                  error: 'Must provide a database username'
                },
                password: {
                  type: 'string',
                  optional: false,
                  error: 'Must provide a database password'
                },
                database: {
                  type: 'string',
                  optional: false,
                  error: 'Must provide a database name'
                }
              }
            },
            pool: {
              type: 'object',
              optional: true,
              properties: {
                min: {
                  type: 'number',
                  optional: true,
                  error: 'Provide a minimum number {number} of pooled database connections'
                },
                max: {
                  type: 'number',
                  optional: true,
                  error: 'Provide a maximum number {number} of pooled database connections'
                }
              }
            },
            migrations: {
              type: 'object',
              optional: true,
              properties: {
                tableName: {
                  type: 'string',
                  optional: true,
                  error: 'Provide a tableName {string} for database migrations'
                },
                directory: {
                  type: 'string',
                  optional: true,
                  error: 'Provide a directory {string} for database migration scripts'
                },
                extension: {
                  type: 'string',
                  optional: true
                },
                disableTransactions: {
                  type: 'boolean',
                  optional: true
                }
              }
            },
            seeds: {
              type: 'object',
              optional: true,
              someKeys: ['directory'],
              properties: {
                directory: {
                  type: 'string',
                  error: 'The directory path should be a string'
                }
              },
              error: 'If provided, it must be an object with at least a `directory` key and a path {string} as the value. See ./docs/config-example.js.'
            }
          }
        }
      }
    },
    websites: {
      type: 'array',
      optional: false,
      minLength: 1,
      items: {
        type: 'object'
      }
    },
    logging: {
      type: 'object',
      optional: false
    }
  }
};

module.exports = {
  sanitization: sanitization,
  constraints: constraints
}

