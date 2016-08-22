const _ = require('underscore');
const rewire = require('rewire');
const constraints = require('../../lib/utils/validation');
const config = require('../../docs/config-example');
const common = require('../common');
const expect = common.expect;
const setup = rewire('../../lib/application/index');


describe('- Validate config.js constraints, a.k.a. "required fields" - ', () => {
  const validateConfig = setup.__get__('validateConfig');
  const logValidationErrors = setup.__get__('logValidationErrors');

  it('should fail if config is empty', () => {
    const config = {};
    expect(() => validateConfig(config)).to.throw(ReferenceError);
  });



  it('should fail if config does not contain database key', () => {
    // Remove the `database` property from the config object
    const testConfig = _.omit(config, ['database']);
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.database');
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.database does not contain a production database', () => {
    const testConfig = {
      database: _.omit(config.database, ['production']),
      websites: config.websites,
      logging: config.logging
    }
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.database.production');
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.database.[production, test, dev] does not have a client key', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database objects, and remove the `client` property
    _.each(db, (element, index) => {
      const dbObject = {};

      dbObject[index] = _.omit(element, ['client']);

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.client',
        '@.database.test.client',
        '@.database.dev.client'
      ]);
      expect(error.message).to.equal('Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"');
    });
  });



  it('should fail if database.[production, test, dev].client is not a MySQL compatible database client', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the client property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['client'] = 'pg';
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.oneOf([
        '@.database.production.client',
        '@.database.test.client',
        '@.database.dev.client'
      ]);
      expect(error.message).to.equal('Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"');
    });
  });



  it('should fail if database.[production, test, dev].connection does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database objects, and remove the `connection` property
    _.each(db, (element, index) => {
      const dbObject = {};

      dbObject[index] = _.omit(element, ['connection']);

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });


    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.oneOf([
        '@.database.production.connection',
        '@.database.test.connection',
        '@.database.dev.connection'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if database.[production, test, dev].connection.host does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['connection'] = _.omit(element.connection, ['host']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.connection.host',
        '@.database.test.connection.host',
        '@.database.dev.connection.host'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should pass if database.[production, test, dev].connection.port does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['connection'] = _.omit(element.connection, ['port']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if port is not a string', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['connection']['port'] = 3306;
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.connection.port',
        '@.database.test.connection.port',
        '@.database.dev.connection.port'
      ]);
      expect(error.message).to.equal('must be string, but is number');
    });
  });



  it('should fail if database.[production, test, dev].connection.user does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['connection'] = _.omit(element.connection, ['user']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.connection.user',
        '@.database.test.connection.user',
        '@.database.dev.connection.user'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if database.[production, test, dev].connection.password does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['connection'] = _.omit(element.connection, ['password']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.connection.password',
        '@.database.test.connection.password',
        '@.database.dev.connection.password'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if database.[production, test, dev].connection.database does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['connection'] = _.omit(element.connection, ['database']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.connection.database',
        '@.database.test.connection.database',
        '@.database.dev.connection.database'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should pass if database.[production, test, dev].pool does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the pool property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index] = _.omit(element, ['pool']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should pass if database.[production, test, dev].pool.min does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the connection property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['pool'] = _.omit(element, ['min']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should pass if database.[production, test, dev].pool.max does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the pool property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['pool'] = _.omit(element, ['max']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if database.[production, test, dev].pool.min and/or database.[production, test, dev].pool.max is not a number', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the pool property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('pool') === true) {
        list[index]['pool']['min'] = '2';
        list[index]['pool']['max'] = '10';
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.pool.min',
        '@.database.production.pool.max',
        '@.database.test.pool.max',
        '@.database.test.pool.min',
        '@.database.dev.pool.max',
        '@.database.dev.pool.min',
      ]);
      expect(error.message).to.equal('must be number, but is string');
    });
  });



  it('should pass if database.[production, test, dev].migrations does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index] = _.omit(element, ['migrations']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should pass if database.[production, test, dev].migrations.tableName does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['migrations'] = _.omit(element, ['tableName']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if database.[production, test, dev].migrations.tableName is not a string', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('migrations') && list[index]['migrations'].hasOwnProperty('tableName')) {
        list[index]['migrations']['tableName'] = ['test'];
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.migrations.tableName',
        '@.database.test.migrations.tableName',
        '@.database.dev.migrations.tableName'
      ]);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if database.[production, test, dev].migrations.directory does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['migrations'] = _.omit(element, ['directory']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if database.[production, test, dev].migrations.directory is not a string', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('migrations') && list[index]['migrations'].hasOwnProperty('directory')) {
        list[index]['migrations']['directory'] = ['test'];
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.migrations.directory',
        '@.database.test.migrations.directory',
        '@.database.dev.migrations.directory'
      ]);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if database.[production, test, dev].migrations.extension does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['migrations'] = _.omit(element, ['extension']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if database.[production, test, dev].migrations.extension is not a string', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('migrations') && list[index]['migrations'].hasOwnProperty('extension')) {
        list[index]['migrations']['extension'] = ['test'];
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.migrations.extension',
        '@.database.test.migrations.extension',
        '@.database.dev.migrations.extension',
      ]);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if database.[production, test, dev].migrations.disableTransactions does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index]['migrations'] = _.omit(element, ['disableTransactions']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if database.[production, test, dev].migrations.disableTransactions is not a boolean', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('migrations') && list[index]['migrations'].hasOwnProperty('disableTransactions')) {
        list[index]['migrations']['disableTransactions'] = 'false';
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.migrations.disableTransactions',
        '@.database.test.migrations.disableTransactions',
        '@.database.dev.migrations.disableTransactions'
      ]);
      expect(error.message).to.equal('must be boolean, but is string');
    });
  });



  it('should succeed if database.[production, test, dev].seeds does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the seeds property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      list[index] = _.omit(element, ['seeds']);
      dbObject[index] = list[index];

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if database.[production, test, dev].seeds is not an object', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('seeds')) {
        list[index]['seeds'] = 'false';
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.seeds',
        '@.database.test.seeds',
        '@.database.dev.seeds'
      ]);
      expect(error.message).to.equal('must be object, but is string');
    });
  });



  it('should fail if database.[production, test, dev].seeds.directory does not exist', () => {
    // Deep clone database from config.database
    const db = JSON.parse(JSON.stringify(config.database));

    const testConfig = {
      database: {},
      websites: config.websites,
      logging: config.logging
    };

    // Loop through each config.database object and mutate the migrations property
    _.each(db, (element, index, list) => {
      const dbObject = {};

      if (list[index].hasOwnProperty('seeds')) {
        list[index]['seeds'] = _.omit(element, ['directory']);
        dbObject[index] = list[index];
      }

      // Append the dbObject to the testConfig.database object
      _.extend(testConfig.database, dbObject);
    });

    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.database.production.seeds.directory',
        '@.database.test.seeds.directory',
        '@.database.dev.seeds.directory'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config does not contain websites key', () => {
    const testConfig = _.omit(config, ['websites']);
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);
    expect(result.error[0].property).to.equal('@.websites');
    expect(result.error[0].message).to.equal('is missing and not optional');
  });



  it('should fail if websites[i].name does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['name'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].name');
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if websites[i].name is not a string', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.name = ['website'];
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].name');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if websites[i].username does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        const web = _.omit(i, ['username']);
        return web;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].username');
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if websites[i].username is not a string', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.username = ['test'];
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].username');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if websites[i].password does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['password'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].password');
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if websites[i].password is not a string', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.password= ['test'];
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].password');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if websites[i].url does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['url'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].url');
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if websites[i].url is not a string', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.url = ['test'];
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].url');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if websites[i].xmlrpc does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['xmlrpc'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if websites[i].xmlrpc is not a string', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.xmlrpc = ['test'];
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].xmlrpc');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if websites[i].languages does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['langauges'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if websites[i].languages is not an array', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.languages = 'test';
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].languages');
      expect(error.message).to.equal('must be array, but is string');
    });
  });



  it('should pass if websites[i].update_frequency does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['update_frequency'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if websites[i].update_frequency is not a string', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.update_frequency = ['test'];
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].update_frequency');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if websites[i].post_types does not exist', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        return _.omit(i, ['post_types'])
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(true);
  });



  it('should fail if websites[i].post_types is not an array', () => {
    // Deep clone websites from config.websites
    const websites = JSON.parse(JSON.stringify(config.websites));
    const testConfig = {
      database: config.database,
      websites: _.map(websites, (i) => {
        i.post_types = 'test';
        return i;
      }),
      logging: config.logging
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      expect(error.property).to.equal('@.websites[' + index + '].post_types');
      expect(error.message).to.equal('must be array, but is string');
    });
  });



  it('should fail if config does not contain logging key', () => {
    const testConfig = _.omit(config, ['logging']);
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.logging');
      expect(error.message).to.equal('is missing and not optional');
    });
  });

  it('should fail if logging.debug_file does not exist', () => {
    const testConfig = {
      database: config.database,
      websites: config.websites,
      logging: _.omit(config.logging, ['debug_file'])
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.logging.debug_file');
      expect(error.message).to.equal('is missing and not optional');
    });
  });

  it('should fail if logging.debug_file is not a string', () => {
    const testConfig = {
      database: config.database,
      websites: config.websites,
      logging: {
        debug_file: ['test'],
        error_file: config.logging.error_file
      }
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.logging.debug_file');
      expect(error.message).to.equal('must be string, but is array');
    });
  });

  it('should fail if logging.error_file does not exist', () => {
    const testConfig = {
      database: config.database,
      websites: config.websites,
      logging: _.omit(config.logging, ['error_file'])
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.logging.error_file');
      expect(error.message).to.equal('is missing and not optional');
    });
  });

  it('should fail if logging.error_file is not a string', () => {
    const testConfig = {
      database: config.database,
      websites: config.websites,
      logging: {
        debug_file: config.logging.debug_file,
        error_file: ['test']
      }
    };
    const result = validateConfig(testConfig);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.logging.error_file');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should not throw an error if the config file is valid', () => {
    const logger = console;
    const result = logValidationErrors(config, logger);

    expect(() => result).to.not.throw(Error);
  });



  it('should throw an error if the config file is not valid', () => {
    const testConfig = {
      database: config.database,
      websites: config.websites
    };
    const logger = console

    expect(() => logValidationErrors(testConfig, logger)).to.throw('@.logging is missing and not optional');
  });
});
