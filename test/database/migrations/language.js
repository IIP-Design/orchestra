const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;

describe('Make sure `language` table exists with proper schema', () => {
  const language = {
    lang_code: 'ar',
    title: 'Arabic'
  };

  const lang_code_null = {
    lang_code: null,
    title: 'Arabic'
  };

  const lang_code_ununique = {
    lang_code: 'ar',
    title: 'Arabic 2'
  };

  const title_null = {
    lang_code: 'ar',
    title: null
  };

  it('should insert correctly and return the language title', () => {
    return knex('language').insert(language)
      .then(() => {
        const result = knex('language').where(language).select('lang_code');
        return expect(result).to.eventually.eql([{ lang_code: 'ar'  }]);
      });
  });

  it('should fail when `lang_code` is null', () => {
    return knex('language').insert(lang_code_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail when `lang_code` is not unique', () => {
    return knex('language').insert(lang_code_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('language').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });
});
