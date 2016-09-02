const path = require('path');
const _ = require('underscore');
const rewire = require('rewire');
const constraints = require(path.resolve('lib/utils/validation.js'));
const config = require(path.resolve('docs/config-example.js'));
const common = require(path.resolve('test/common.js'));
const expect = common.expect;
const utilities = rewire(path.resolve('lib/utils/index.js'));



/**
  * A utility function to speed up writing test cases for validation
  *
  * @param {object} args - An object with at least the config object
  * @param {function} callback - The unique test thing to test
  *
  */

function createTestCase(args, callback) {
  const clone = JSON.parse(JSON.stringify(args.config));
  const test = {};

  _.each(clone, (env, index, list) => {
    let environment = {};
    environment[index] = env;
    environment = callback(env, environment, index);
    _.extend(test, environment);
  });

  return test;
}




describe('- Validate config.js constraints, a.k.a. "required fields" - ', () => {
  const validateConfig = utilities.__get__('validateConfig');
  const logValidationErrors = utilities.__get__('logValidationErrors');
  const args = { config: config };



  it('should fail if config is empty', () => {
    const config = {};
    expect(() => validateConfig(config)).to.throw(ReferenceError);
  });



  it('should pass if config contains at least one environment [production, test, development]', () => {
    const test = _.omit(config, ['production', 'test']);
    const result = validateConfig(test);
    expect(result.valid).to.equal(true);
  });



  it('should fail if [production, test, development] does not contain database key', () => {
    function removeDatabaseKey(env, environment, index) {
      environment[index] = _.omit(env, ['database']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseKey);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.oneOf([
        '@.production.database',
        '@.test.database',
        '@.development.database',
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].database does not have a client key', () => {
    function removeClientKey(env, environment, index) {
      environment[index]['database'] = _.omit(env.database, ['client'])
      return environment;
    }

    const test = createTestCase(args, removeClientKey);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);
    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.client',
        '@.test.database.client',
        '@.development.database.client'
      ]);
      expect(error.message).to.equal('Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"');
    });
  });



  it('should fail if config.[production, test, development].database.client is not a MySQL compatible database client', () => {
    function incompatibleDatabaseClient(env, environment, index) {
      environment[index]['database']['client'] = 'pg';
      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseClient);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.oneOf([
        '@.production.database.client',
        '@.test.database.client',
        '@.development.database.client'
      ]);
      expect(error.message).to.equal('Must provide a valid MySQL compatible Node.js client, such as "mysql", "mysql2, "mariasql"');
    });
  });



  it('should fail if config.[production, test, development].database.connection does not exist', () => {
    function removeDatabaseClient(env, environment, index) {
      environment[index]['database'] = _.omit(env.database, ['connection']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseClient);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.oneOf([
        '@.production.database.connection',
        '@.test.database.connection',
        '@.development.database.connection'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].database.connection.host does not exist', () => {
    function removeDatabaseConnectionHost(env, environment, index) {
      environment[index]['database']['connection'] = _.omit(env.database.connection, ['host']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseConnectionHost);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.connection.host',
        '@.test.database.connection.host',
        '@.development.database.connection.host'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should pass if config.[production, test, development].database.connection.port does not exist', () => {
    function removeDatabaseConnectionPort(env, environment, index) {
      environment[index]['database']['connection'] = _.omit(env.database.connection, ['port']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseConnectionPort);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development].database.connection.port is not a string', () => {
    function incompatiblePrimativePort(env, environment, index) {
      environment[index]['database']['connection']['port'] = 3306;
      return environment;
    }

    const test = createTestCase(args, incompatiblePrimativePort);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.connection.port',
        '@.test.database.connection.port',
        '@.development.database.connection.port'
      ]);
      expect(error.message).to.equal('must be string, but is number');
    });
  });



  it('should fail if config.[production, test, development].datbase.connection.user does not exist', () => {
    function removeDatabaseConnectionUser(env, environment, index) {
      environment[index]['database']['connection'] = _.omit(env.database.connection, ['user']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseConnectionUser);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.connection.user',
        '@.test.database.connection.user',
        '@.development.database.connection.user'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].database.connection.password does not exist', () => {
    function removeDatabaseConnectionPassword(env, environment, index) {
      environment[index]['database']['connection'] = _.omit(env.database.connection, ['password']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseConnectionPassword);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.connection.password',
        '@.test.database.connection.password',
        '@.development.database.connection.password'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].database.connection.password is not a string', () => {
    function incompatiblePrimativePassword(env, environment, index) {
      environment[index]['database']['connection']['password'] = 4444;
      return environment;
    }

    const test = createTestCase(args, incompatiblePrimativePassword);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.connection.password',
        '@.test.database.connection.password',
        '@.development.database.connection.password'
      ]);
      expect(error.message).to.equal('must be string, but is number');
    });
  });



  it('should fail if config.[production, test, development].database.connection.database does not exist', () => {
    function removeDatabaseConnectionDatabase(env, environment, index) {
      environment[index]['database']['connection'] = _.omit(env.database.connection, ['database']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseConnectionDatabase);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.connection.database',
        '@.test.database.connection.database',
        '@.development.database.connection.database'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should pass if config.[production, test, development].database.pool does not exist', () => {
    function removeDatabasePool(env, environment, index) {
      environment[index]['database'] = _.omit(env.database, ['pool']);
      return environment;
    }

    const test = createTestCase(args, removeDatabasePool);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should pass if config.[production, test, development].database.pool.min does not exist', () => {
    function removeDatabasePoolMin(env, environment, index) {
      environment[index]['database']['pool'] = _.omit(env.database.pool, ['min']);
      return environment;
    }

    const test = createTestCase(args, removeDatabasePoolMin);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should pass if config.[production, test, development].database.pool.max does not exist', () => {
    function removeDatabasePoolMax(env, environment, index) {
      environment[index]['database']['pool'] = _.omit(env.database.pool, ['max']);
      return environment;
    }

    const test = createTestCase(args, removeDatabasePoolMax);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development]..pool.min and/or config.[production, test, development]..pool.max is not a number', () => {
    function incompatibleDatabasePoolMinMaxType(env, environment, index) {
      if (environment[index]['database']['pool'] !== undefined) {
        environment[index]['database']['pool']['min'] = '2';
      }

      if (environment[index]['database']['pool'] !== undefined) {
        environment[index]['database']['pool']['max'] = '10';
      }

      return environment;
    }

    const test = createTestCase(args, incompatibleDatabasePoolMinMaxType);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.pool.min',
        '@.production.database.pool.max'
      ]);
      expect(error.message).to.equal('must be number, but is string');
    });
  });



  it('should pass if config.[production, test, development].database.migrations does not exist', () => {
    function removeDatabaseMigrations(env, environment, index) {
      environment[index]['database'] = _.omit(env.database, ['migrations']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseMigrations);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should pass if config.[production, test, development].database.migrations.tableName does not exist', () => {
    function removeDatabaseMigrationsTableName(env, environment, index) {
      environment[index]['database']['migrations'] = _.omit(env.database.migrations, ['tableName']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseMigrationsTableName);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development].database.migrations.tableName is not a string', () => {
    function incompatibleDatabaseMigrationsTableName(env, environment, index) {
      if (environment[index]['database']['migrations'] !== undefined) {
        environment[index]['database']['migrations']['tableName'] = ['test'];
      }

      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseMigrationsTableName);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.production.database.migrations.tableName');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if config.[production, test, development].database.migrations.directory does not exist', () => {
    function removeDatabaseMigrationsDirectory(env, environment, index) {
      environment[index]['database']['migrations'] = _.omit(env.database.migrations, ['directory']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseMigrationsDirectory);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development]..migrations.directory is not a string', () => {
    function incompatibleDatabaseMigrationsDirectory(env, environment, index) {
      if (environment[index]['database']['migrations'] !== undefined) {
        environment[index]['database']['migrations']['directory'] = ['test'];
      }

      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseMigrationsDirectory);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.production.database.migrations.directory');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if config.[production, test, development].database.migrations.extension does not exist', () => {
    function incompatibleDatabaseMigrationsExtensions(env, environment, index) {
      environment[index]['database']['migrations'] = _.omit(env.database.migrations, ['extension']);
      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseMigrationsExtensions);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development]..migrations.extension is not a string', () => {
    function incompatibleDatabaseMigrationsExtension(env, environment, index) {
      if (environment[index]['database']['migrations'] !== undefined) {
        environment[index]['database']['migrations']['extension'] = ['test'];
      }

      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseMigrationsExtension);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.production.database.migrations.extension');
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if config.[production, test, development].database.migrations.disableTransactions does not exist', () => {
    function removeDatabaseMigrationsDisableTransactions(env, environment, index) {
      environment[index]['database']['migrations'] = _.omit(env.database.migrations, ['disableTransactions']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseMigrationsDisableTransactions);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development]..migrations.disableTransactions is not a boolean', () => {
    function incompatibleDatabaseMigrationsDisableTransactions(env, environment, index) {
      if (environment[index]['database']['migrations'] !== undefined) {
        environment[index]['database']['migrations']['disableTransactions'] = 'false';
      }

      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseMigrationsDisableTransactions);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);
    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.production.database.migrations.disableTransactions');
      expect(error.message).to.equal('must be boolean, but is string');
    });
  });



  it('should pass if config.[production, test, development].database.seeds does not exist', () => {
    function removeDatabaseSeeds(env, environment, index) {
      environment[index]['database'] = _.omit(env.database, ['seeds']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseSeeds);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development]..seeds is not an object', () => {
    function incompatibleDatabaseSeeds(env, environment, index) {
      if (environment[index]['database']['seeds'] !== undefined) {
        environment[index]['database']['seeds'] = 'seeds';
      }

      return environment;
    }

    const test = createTestCase(args, incompatibleDatabaseSeeds);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.equal('@.production.database.seeds');
      expect(error.message).to.equal('must be object, but is string');
    });
  });



  it('should fail if config.[production, test, development].database.seeds.directory does not exist', () => {
    function removeDatabaseSeedsDirectory(env, environment, index) {
      environment[index]['database']['seeds'] = _.omit(env.database.seeds, ['directory']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseSeedsDirectory);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.database.seeds.directory',
        '@.test.database.seeds.directory',
        '@.development.database.seeds.directory'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development] does not contain websites key', () => {
    function removeDatabaseSeedsDirectory(env, environment, index) {
      environment[index] = _.omit(env, ['websites']);
      return environment;
    }

    const test = createTestCase(args, removeDatabaseSeedsDirectory);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.websites',
        '@.test.websites',
        '@.development.websites',
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].websites[i].name does not exist', () => {
    function removeWebsiteName(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['name']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsiteName);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].name');
      props.push('@.test.websites[' + index + '].name');
      props.push('@.development.websites[' + index + '].name');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].websites[i].name is not a string', () => {
    function incompatibleWebsiteName(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.name = ['website'];
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsiteName);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].name');
      props.push('@.test.websites[' + index + '].name');
      props.push('@.development.websites[' + index + '].name');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if config.[production, test, development].websites[i].username does not exist', () => {
    function removeWebsiteUsername(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['username']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsiteUsername);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].username');
      props.push('@.test.websites[' + index + '].username');
      props.push('@.development.websites[' + index + '].username');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].websites[i].username is not a string', () => {
    function incompatibleWebsiteUsername(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.username = ['username'];
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsiteUsername);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].username');
      props.push('@.test.websites[' + index + '].username');
      props.push('@.development.websites[' + index + '].username');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if config.[production, test, development].websites[i].password does not exist', () => {
    function removeWebsitePassword(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['password']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsitePassword);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].password');
      props.push('@.test.websites[' + index + '].password');
      props.push('@.development.websites[' + index + '].password');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].websites[i].password is not a string', () => {
    function incompatibleWebsitePassword(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.password = ['password'];
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsitePassword);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].password');
      props.push('@.test.websites[' + index + '].password');
      props.push('@.development.websites[' + index + '].password');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if config.[production, test, development].websites[i].url does not exist', () => {
    function removeWebsiteUrl(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['url']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsiteUrl);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].url');
      props.push('@.test.websites[' + index + '].url');
      props.push('@.development.websites[' + index + '].url');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].websites[i].url is not a string', () => {
    function incompatibleWebsiteUrl(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.url = ['url'];
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsiteUrl);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].url');
      props.push('@.test.websites[' + index + '].url');
      props.push('@.development.websites[' + index + '].url');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if config.[production, test, development].websites[i].api_url does not exist', () => {
    function removeWebsiteApiUrl(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['api_url']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsiteApiUrl);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development].websites[i].api_url is not a string', () => {
    function incompatibleWebsiteApiUrl(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.api_url = ['api_url'];
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsiteApiUrl);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].api_url');
      props.push('@.test.websites[' + index + '].api_url');
      props.push('@.development.websites[' + index + '].api_url');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should pass if config.[production, test, development].websites[i].languages does not exist', () => {
    function removeWebsiteLanguages(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['languages']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsiteLanguages);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development].websites[i].languages is not an array', () => {
    function incompatibleWebsiteLanguages(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.languages = 'en';
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsiteLanguages);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].languages');
      props.push('@.test.websites[' + index + '].languages');
      props.push('@.development.websites[' + index + '].languages');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be array, but is string');
    });
  });



  it('should pass if config.[production, test, development].websites[i].update_frequency does not exist', () => {
    function removeWebsiteUpdateFreq(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['update_frequency']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsiteUpdateFreq);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development].websites[i].update_frequency is not a number', () => {
    function incompatibleWebsiteUpdateFreq(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.update_frequency = '30000';
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsiteUpdateFreq);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].update_frequency');
      props.push('@.test.websites[' + index + '].update_frequency');
      props.push('@.development.websites[' + index + '].update_frequency');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be number, but is string');
    });
  });



  it('should pass if config.[production, test, development].websites[i].post_types does not exist', () => {
    function removeWebsitePostTypes(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        return _.omit(i, ['post_types']);
      });

      return environment;
    }

    const test = createTestCase(args, removeWebsitePostTypes);
    const result = validateConfig(test);

    expect(result.valid).to.equal(true);
  });



  it('should fail if config.[production, test, development].websites[i].post_types is not an array', () => {
    function incompatibleWebsitePostTypes(env, environment, index) {
      environment[index]['websites'] = _.map(env.websites, (i) => {
        i.post_types = 'post';
        return i;
      });

      return environment;
    }

    const test = createTestCase(args, incompatibleWebsitePostTypes);
    const result = validateConfig(test);
    const props = [];

    expect(result.valid).to.equal(false);

    _.each(result.error, (error, index) => {
      props.push('@.production.websites[' + index + '].post_types');
      props.push('@.test.websites[' + index + '].post_types');
      props.push('@.development.websites[' + index + '].post_types');

      expect(error.property).to.be.oneOf(props);
      expect(error.message).to.equal('must be array, but is string');
    });
  });



  it('should fail if config.[production, test, development] does not contain logging key', () => {
    function removeLoggingKey(env, environment, index) {
      environment[index] = _.omit(env, ['logging']);
      return environment;
    }

    const test = createTestCase(args, removeLoggingKey);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.oneOf([
        '@.production.logging',
        '@.test.logging',
        '@.development.logging',
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].logging.debug_file does not exist', () => {
    function removeLoggingDebugFile(env, environment, index) {
      environment[index]['logging'] = _.omit(env.logging, ['debug_file']);
      return environment;
    }

    const test = createTestCase(args, removeLoggingDebugFile);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.logging.debug_file',
        '@.test.logging.debug_file',
        '@.development.logging.debug_file'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });



  it('should fail if config.[production, test, development].logging.debug_file is not a string', () => {
    function incompatibleLoggingDebugFile(env, environment, index) {
      environment[index]['logging']['debug_file'] = ['/path/to/file'];
      return environment;
    }

    const test = createTestCase(args, incompatibleLoggingDebugFile);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.logging.debug_file',
        '@.test.logging.debug_file',
        '@.development.logging.debug_file'
      ]);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should fail if config.[production, test, development].logging.error_file does not exist', () => {
    function removeLoggingErrorFile(env, environment, index) {
      environment[index]['logging'] = _.omit(env.logging, ['error_file']);
      return environment;
    }

    const test = createTestCase(args, removeLoggingErrorFile);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.logging.error_file',
        '@.test.logging.error_file',
        '@.development.logging.error_file'
      ]);
      expect(error.message).to.equal('is missing and not optional');
    });
  });

  it('should fail if config.[production, test, development].logging.error_file is not a string', () => {
    function incompatibleLoggingErrorFile(env, environment, index) {
      environment[index]['logging']['error_file'] = ['/path/to/file'];
      return environment;
    }

    const test = createTestCase(args, incompatibleLoggingErrorFile);
    const result = validateConfig(test);

    expect(result.valid).to.equal(false);

    expect(result.valid).to.equal(false);

    _.each(result.error, (error) => {
      expect(error.property).to.be.oneOf([
        '@.production.logging.error_file',
        '@.test.logging.error_file',
        '@.development.logging.error_file'
      ]);
      expect(error.message).to.equal('must be string, but is array');
    });
  });



  it('should not throw an error if the config file is valid', () => {
    const logger = console;
    const result = logValidationErrors(config, logger);

    expect(() => result).to.not.throw(Error);
  });



  it('should throw an error if the config file is not valid', () => {
    const test = {
      database: config.database,
      websites: config.websites
    };
    const logger = console

    expect(() => logValidationErrors(test, logger)).to.throw('@ must have at least key "production" or "test" or "development"');
  });
});
