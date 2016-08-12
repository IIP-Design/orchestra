const sanitization = {};

const constraints = {
  type: 'object',
  properties: {
    database: {
      type: 'object',
      properties: {
        production: {
          type: 'object',
          properties: {
            client: {
              type: 'string',
              minLength: 1,
              eq: ['pg', 'sqlite3', 'mysql', 'mysql2', 'mariasql', 'strong-oracle', 'oracle', 'mssql'],
              error: 'Must provide a valid database client'
            },
            connection: {
              type: 'object',
              properties: {
                host: {
                  type: 'string',
                  minLength: 1,
                  error: 'Must provide a database host ip'
                },
                port: {
                  type: 'string',
                  minLength: 1,
                  error: 'Must provide a database port'
                },
                user: {
                  type: 'string',
                  minLength: 1,
                  error: 'Must provide a database username'
                },
                password: {
                  type: 'string',
                  minLength: 1,
                  error: 'Must provide a database password'
                },
                database: {
                  type: 'string',
                  minLength: 1,
                  error: 'Must provide a database name'
                }
              }
            },
            pool: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  optional: false,
                  gte: 0,
                  error: 'Must provide a minimum number of pooled database connections'
                },
                max: {
                  type: 'number',
                  optional: false,
                  gte: 0,
                  error: 'Must provide a maximum number of pooled database connections'
                }
              }
            },
            migrations: {
              type: 'object',
              properties: {
                tableName: {
                  type: 'string',
                  optional: false,
                  error: 'Must provide a tableName {string} for database migrations'
                },
                directory: {
                  type: 'string',
                  optional: false,
                  error: 'Must provide a directory {string} for database migration scripts'
                }
              }
            },
            seeds: {
              type: 'object',
              optional: true,
              properties: {
                directory: {
                  type: 'string',
                  error: 'The directory path should be a string'
                }
              }
            }
          }
        }
      }
    },
    websites: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    logging: {
      type: 'object'
    }
  }
};

module.exports = {
  sanitization: sanitization,
  constraints: constraints
}

