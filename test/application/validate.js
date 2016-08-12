const rewire = require('rewire');
const constraints = require('../../lib/utils/validation');
const common = require('../common');
const expect = common.expect;
const setup = rewire('../../lib/application/setup');


describe('Validate config.js constraints, a.k.a. "required fields"', () => {
  const validateConfig = setup.__get__('validateConfig');

  it('should fail if config is empty', () => {
    const config = {}
    expect(() => validateConfig(config)).to.throw(ReferenceError);
  });

  it('should fail if config does not contain database key', () => {
    const config = {
      websites: {},
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if config.database does not contain a production database', () => {
    const config = {
      database: {},
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if config.database.production does not have a client key', () => {
    const config = {
      database: {
        production: {
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.client');
    expect(result.error[0].message).to.equal('Must provide a valid database client');
  });

  it('should fail if database.production.connection does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if database.production.connection.host does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.host');
    expect(result.error[0].message).to.equal('Must provide a database host ip');
  });

  it('should fail if database.production.connection.port does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.port');
    expect(result.error[0].message).to.equal('Must provide a database port');
  });

  it('should fail if database.production.connection.user does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.user');
    expect(result.error[0].message).to.equal('Must provide a database username');
  });

  it('should fail if database.production.connection.password does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.password');
    expect(result.error[0].message).to.equal('Must provide a database password');
  });

  it('should fail if database.production.connection.database does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
          }
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
          tableName: 'migrations',
          directory: 'path/to/migrations/dir'
        },
        seeds: {
          directory: 'path/to/seeds/dir'
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.database');
    expect(result.error[0].message).to.equal('Must provide a database name');
  });

  it('should fail if database.production.pool does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.pool');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if database.production.pool.min does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.pool.min');
    expect(result.error[0].message).to.equal('Must provide a minimum number of pooled database connections');
  });

  it('should fail if database.production.pool.max does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min:2
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.pool.max');
    expect(result.error[0].message).to.equal('Must provide a maximum number of pooled database connections');
  });

  it('should fail if database.production.migrations does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min:2,
            max: 10
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if database.production.migrations.tableName does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations.tableName');
    expect(result.error[0].message).to.equal('Must provide a tableName {string} for database migrations');
  });

  it('should fail if database.production.migrations.directory does not exist', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 4
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations.directory');
    expect(result.error[0].message).to.equal('Must provide a directory {string} for database migration scripts');
  });

  it('should not fail if database.production.seeds', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/dir'
          }
        }
      },
      websites: [],
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(true);
  });

  it('should fail if config does not contain websites key', () => {
    const config = {
      database: {
        production: {
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: '3306',
            user: 'ninasimone',
            password: 'sinnerman',
            database: 'database'
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: 'migrations',
            directory: 'path/to/migrations/dir'
          },
          seeds: {
            directory: 'path/to/seeds/dir'
          }
        },
      },
      logging: {}
    };
    const result = validateConfig(config);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.websites');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  // it('should fail if config does not contain logging key', () => {
  //   const config = {
  //     database: {
  //       production: {
  //         client: 'mysql'
  //       }
  //     },
  //     websites: []
  //   };
  //   const result = validateConfig(config);

  //   expect(result.valid).to.equal(false);
  //   expect(result.error[0].property).to.equal('@.logging');
  //   expect(result.error[0].message).to.equal('is missing and not optional');
  // });
});
