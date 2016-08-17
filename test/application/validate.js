const _ = require('underscore');
const rewire = require('rewire');
const constraints = require('../../lib/utils/validation');
const config = require('../../config');
const common = require('../common');
const expect = common.expect;
const setup = rewire('../../lib/application/setup');


describe('- Validate config.js constraints, a.k.a. "required fields" - ', () => {
  const validateConfig = setup.__get__('validateConfig');

  it('should fail if config is empty', () => {
    const config = {};
    expect(() => validateConfig(config)).to.throw(ReferenceError);
  });

  it('should fail if config does not contain database key', () => {
    const testConfig = _.omit(config, ['database']);
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if config.database does not contain a production database', () => {
    const testConfig = {
      database: {
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    }
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if config.database.production does not have a client key', () => {
    const testConfig = {
      database: {
        production: _.omit(config.database.production, ['client']),
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.client');
    expect(result.error[0].message).to.equal('Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"');
  });

  it('should fail if database.production.client is not a MySQL compatible database client', () => {
    const testConfig = {
      database: {
        production: {
          client: 'pg',
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.client');
    expect(result.error[0].message).to.equal('Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"');
  });

  it('should fail if database.production.connection does not exist', () => {
    const testConfig = {
      database: {
        production: _.omit(config.database.production, ['connection']),
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if database.production.connection.host does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: _.omit(config.database.production.connection, ['host']),
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.host');
    expect(result.error[0].message).to.equal('Must provide a database host ip');
  });

  it('should pass if database.production.connection.port does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: _.omit(config.database.production.connection, ['port']),
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should fail if port is not a string', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: {
            host: config.database.production.connection.host,
            port: 3306,
            user: config.database.production.connection.user,
            password: config.database.production.connection.password,
            database: config.database.production.connection.database
          },
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.port');
    expect(result.error[0].message).to.equal('must be string, but is number');
  });

  it('should fail if database.production.connection.user does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: _.omit(config.database.production.connection, ['user']),
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.user');
    expect(result.error[0].message).to.equal('Must provide a database username');
  });

  it('should fail if database.production.connection.password does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: _.omit(config.database.production.connection, ['password']),
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.password');
    expect(result.error[0].message).to.equal('Must provide a database password');
  });

  it('should fail if database.production.connection.database does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: _.omit(config.database.production.connection, ['database']),
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.connection.database');
    expect(result.error[0].message).to.equal('Must provide a database name');
  });

  it('should pass if database.production.pool does not exist', () => {
    const testConfig = {
      database: {
        production: _.omit(config.database.production, ['pool']),
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should pass if database.production.pool.min does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: _.omit(config.database.production.pool, ['min']),
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should pass if database.production.pool.max does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: _.omit(config.database.production.pool, ['max']),
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should fail if database.production.pool.min and/or database.production.pool.max is not a number', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: {
            min: '2',
            max: '10'
          },
          migrations: config.database.production.migrations,
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.pool.min');
    expect(result.error[0].message).to.equal('Provide a minimum number {number} of pooled database connections');
    expect(result.error[1].property).to.equal('@.database.production.pool.max');
    expect(result.error[1].message).to.equal('Provide a maximum number {number} of pooled database connections');
  });

  it('should pass if database.production.migrations does not exist', () => {
    const testConfig = {
      database: {
        production: _.omit(config.database.production, ['migrations']),
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should pass if database.production.migrations.tableName does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: _.omit(config.database.production.migrations, ['tableName']),
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should fail if database.production.migrations.tableName is not a string', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: {
            tableName: ['migrations'],
            directory: config.database.production.migrations.directory
          },
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations.tableName');
    expect(result.error[0].message).to.equal('Provide a tableName {string} for database migrations');
  });

  it('should pass if database.production.migrations.directory does not exist', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: _.omit(config.database.production.migrations, ['directory']),
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);


    expect(result.valid).to.equal(true);
  });

  it('should fail if database.production.migrations.directory is not a string', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: {
            tableName: config.database.production.migrations.tableName,
            directory: ['directory']
          },
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations.directory');
    expect(result.error[0].message).to.equal('Provide a directory {string} for database migration scripts');
  });

  it('should pass if database.production.migrations.extension does not exist', () => {
    const testConfig = config;
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should fail if database.production.migrations.extension is not a string', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: {
            tableName: config.database.production.migrations.tableName,
            directory: config.database.production.migrations.directory,
            extension: ['js'],
          },
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations.extension');
    expect(result.error[0].message).to.equal('must be string, but is array');
  });

  it('should pass if database.production.migrations.disableTransactions does not exist', () => {
    const testConfig = config;
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should fail if database.production.migrations.disableTransactions is not a boolean', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: {
            tableName: config.database.production.migrations.tableName,
            directory: config.database.production.migrations.directory,
            disableTransactions: 'false',
          },
          seeds: config.database.production.seeds
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.migrations.disableTransactions');
    expect(result.error[0].message).to.equal('must be boolean, but is string');
  });

  it('should succeed if database.production.seeds does not exist', () => {
    const testConfig = {
      database: {
        production: _.omit(config.database.production, ['seeds']),
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });

  it('should fail if database.production.seeds is not an object', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: 'seeds'
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.seeds');
    expect(result.error[0].message).to.equal('If provided, it must be an object with at least a `directory` key and a path {string} as the value. See ./docs/config-example.js.');
  });

  it('should succeed if database.production.seeds.directory is empty', () => {
    const testConfig = {
      database: {
        production: {
          client: config.database.production.client,
          connection: config.database.production.connection,
          pool: config.database.production.pool,
          migrations: config.database.production.migrations,
          seeds: _.omit(config.database.production.seeds, ['directory'])
        },
        test: config.database.test,
        dev: config.database.dev
      },
      websites: config.websites,
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.database.production.seeds');
    expect(result.error[0].message).to.equal('If provided, it must be an object with at least a `directory` key and a path {string} as the value. See ./docs/config-example.js.');
  });

  it('should fail if config does not contain websites key', () => {
    const testConfig = _.omit(config, ['websites']);
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.websites');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });

  it('should fail if config does not contain logging key', () => {
    const testConfig = _.omit(config, ['logging']);
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.logging');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });
});
