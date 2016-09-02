const path = require('path');
const common = require(path.resolve('test/common'));
const knex = common.knex;
const expect = common.expect;


describe('Ensure that `lesson_media` table exists with proper schema', () => {
  const lesson_media = {
    media_id: 1,
    lesson_id: 1
  };

  const media_id_null = {
    media_id: null,
    lesson_id: 1
  };

  const lesson_id_null = {
    media_id: 1,
    lesson_id: null
  };

  const media_key_nonexistent = {
    media_id: 1234,
    lesson_id: 1
  };

  const lesson_key_nonexistent = {
    media_id: 1,
    lesson_id: 1234
  };

  it('should insert `lesson_media` correctly and return the media_id', () => {
    return knex('lesson_media').insert(lesson_media)
      .then(() => {
        const result = knex('lesson_media').where(lesson_media).select('media_id');
        return expect(result).to.eventually.eql([{ media_id: 1 }]);
      });
  });

  it('should fail if `media_id` is null', () => {
    return knex('lesson_media').insert(media_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `lesson_id` is null', () => {
    return knex('lesson_media').insert(lesson_id_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `media_id` references a nonexistent code', () => {
    return knex('lesson_media').insert(media_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });

  it('should fail if `lesson_id` references a nonexistent code', () => {
    return knex('lesson_media').insert(lesson_key_nonexistent)
      .catch((err) => {
        expect(err.errno).to.equal(1452);
        expect(err.code).to.equal('ER_NO_REFERENCED_ROW_2');
      });
  });
});

