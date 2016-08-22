const database = {
  optional: false,
  type: 'object',
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
        },
        port: {
          type: 'string',
          optional: true,
        },
        user: {
          type: 'string',
          optional: false,
        },
        password: {
          type: 'string',
          optional: false,
        },
        database: {
          type: 'string',
          optional: false,
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
        },
        max: {
          type: 'number',
          optional: true,
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
        },
        directory: {
          type: 'string',
          optional: true,
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
      properties: {
        directory: {
          type: 'string',
        }
      }
    }
  }
};

const websites = {
  type: 'array',
  optional: false,
  minLength: 1,
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        optional: false
      },
      username: {
        type: 'string',
        optional: false
      },
      password: {
        type: 'string',
        optional: false
      },
      url: {
        type: 'string',
        optional: false
      },
      xmlrpc: {
        type: 'string',
        optional: true
      },
      languages: {
        type: 'array',
        optional: true
      },
      update_frequency: {
        type: 'string',
        optional: true
      },
      post_types: {
        type: 'array',
        optional: true
      }
    }
  }
};

const logging = {
  type: 'object',
  optional: false,
  properties: {
    debug_file: {
      type: 'string',
      optional: false
    },
    error_file: {
      type: 'string',
      optional: false
    }
  }
};

const constraints = {
  type: 'object',
  someKeys: ['production', 'test', 'development'],
  properties: {
    production: {
      type: 'object',
      optional: true,
      properties: {
        database: database,
        websites: websites,
        logging: logging
      }
    },
    test: {
      type: 'object',
      optional: true,
      properties: {
        database: database,
        websites: websites,
        logging: logging
      }
    },
    development: {
      type: 'object',
      optional: true,
      properties: {
        database: database,
        websites: websites,
        logging: logging
      }
    }
  }
};

module.exports = {
  constraints: constraints
}

