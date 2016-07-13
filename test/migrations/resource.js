const common = require('../common');
const knex = common.knex;
const expect = common.expect;

describe('Ensure `resource` table exists with proper schema', () => {
  const now = (new Date()).toJSON();

  const resource = {
    date_created: now,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy',
    resource_type: 1
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy',
    resource_type: 1
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy',
    resource_type: 1
  };

  const title_null = {
    date_created: now,
    date_modified: now,
    title: null,
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy',
    resource_type: 1
  };

  const description_null = {
    date_created: now,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: null,
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy',
    resource_type: 1
  };

  const url_null = {
    date_created: now,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: null,
    resource_type: 1
  };

  const url_ununique = {
    date_created: now,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy',
    resource_type: 1
  };

  const resource_type_null = {
    date_created: now,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy/2',
    resource_type: null
  };

  const resource_type_invalid = {
    date_created: now,
    date_modified: now,
    title: 'Tinker, Tailor, Soldier, Spy',
    description: 'In the bleak days of the Cold War, espionage veteran George Smiley is forced from semi-retirement to uncover a Soviet agent within MI6.',
    url: 'http://www.focusfeatures.com/tinker_tailor_soldier_spy/3',
    resource_type: 100
  };

  it('should insert correctly and return the resource title', () => {
    return knex('resource').insert(resource)
      .then(() => {
        const result = knex('resource').where(resource).select('title');
        return expect(result).to.eventually.eql([{ title: 'Tinker, Tailor, Soldier, Spy' }]);
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('resource').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('resource').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('resource').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `description` is null', () => {
    return knex('resource').insert(description_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `url` is null', () => {
    return knex('resource').insert(url_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `url` is not unique', () => {
    return knex('resource').insert(url_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });

  it('should fail if `resource_type` is null', () => {
    return knex('resource').insert(resource_type_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `resource_type` is not a valid foreign key', () => {
    return knex('resource').insert(resource_type_invalid)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});
