const common = require('../common');
const knex = common.knex;
const expect = common.expect;
const config = common.config;

describe('Ensure `media` table exists with proper schema', () => {
  const now = (new Date()).toJSON();

  const media = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/cycle_4_3.png',
    transcript: 1
  };

  const src_url_ununique = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/1/cycle_4_3.png',
    transcript: 1
  };

  const file_url_ununique = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/1/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/cycle_4_3.png',
    transcript: 1
  };

  const date_created_null = {
    date_created: null,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/2/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/2/cycle_4_3.png',
    transcript: 1
  };

  const date_modified_null = {
    date_created: now,
    date_modified: null,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/3/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/3/cycle_4_3.png',
    transcript: 1
  };

  const title_null = {
    date_created: now,
    date_modified: now,
    title: null,
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/4/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/4/cycle_4_3.png',
    transcript: 1
  };

  const media_type_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: null,
    src_url: 'http://www.wpclipart.com/people/family/5/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/5/cycle_4_3.png',
    transcript: 1
  };

  const src_url_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: null,
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family6//cycle_4_3.png',
    transcript: 1
  };

  const alt_text_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: null,
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/7/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/7/cycle_4_3.png',
    transcript: 1
  };

  const img_caption_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: null,
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/8/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/8/cycle_4_3.png',
    transcript: 1
  };

  const width_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/9/cycle_4_3.png',
    width: null,
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/9/cycle_4_3.png',
    transcript: 1
  };

  const height_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/10/cycle_4_3.png',
    width: '459',
    height: null,
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/10/cycle_4_3.png',
    transcript: 1
  };

  const duration_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/11/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: null,
    file_url: 'http://www.wpclipart.com/people/family/11/cycle_4_3.png',
    transcript: 1
  };

  const file_url_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/12/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: null,
    transcript: 1
  };

  const transcript_null = {
    date_created: now,
    date_modified: now,
    title: 'Family photo',
    alt_text: 'Dad, mom, and me posing on our bike',
    img_caption: 'Look at that beautiful family',
    media_type: 1,
    src_url: 'http://www.wpclipart.com/people/family/13/cycle_4_3.png',
    width: '459',
    height: '371',
    duration: 94,
    file_url: 'http://www.wpclipart.com/people/family/13/cycle_4_3.png',
    transcript: null
  };


  it('should insert `media` correctly and return the `src_url`', () => {
    return knex('media').insert(media)
      .then(() => {
        const result = knex('media').where(media).select('src_url');
        return expect(result).to.eventually.eql([{ src_url: 'http://www.wpclipart.com/people/family/cycle_4_3.png' }]);
      });
  });

  it('should insert if `alt_text` is null', () => {
    return knex('media').insert(alt_text_null)
      .then(() => {
        const result = knex('media').where(alt_text_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should pass if `img_caption` is null', () => {
    return knex('media').insert(img_caption_null)
      .then(() => {
        const result = knex('media').where(img_caption_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should pass if `width` is null', () => {
    return knex('media').insert(width_null)
      .then(() => {
        const result = knex('media').where(width_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should pass if `height` is null', () => {
    return knex('media').insert(height_null)
      .then(() => {
        const result = knex('media').where(height_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should pass if `duration` is null', () => {
    return knex('media').insert(duration_null)
      .then(() => {
        const result = knex('media').where(duration_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should pass if `file_url` is null', () => {
    return knex('media').insert(file_url_null)
      .then(() => {
        const result = knex('media').where(file_url_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should pass if `transcript` is null', () => {
    return knex('media').insert(transcript_null)
      .then(() => {
        const result = knex('media').where(transcript_null).select('title');
        return expect(result).to.eventually.eql([{ title: 'Family photo' }]);
      });
  });

  it('should fail if `date_created` is null', () => {
    return knex('media').insert(date_created_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `date_modified` is null', () => {
    return knex('media').insert(date_modified_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `title` is null', () => {
    return knex('media').insert(title_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `media_type` is null', () => {
    return knex('media').insert(media_type_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `src_url` is null', () => {
    return knex('media').insert(src_url_null)
      .catch((err) => {
        expect(err.errno).to.equal(1048);
        expect(err.code).to.equal('ER_BAD_NULL_ERROR');
      });
  });

  it('should fail if `src_url` is not unique', () => {
    return knex('media').insert(src_url_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });

  it('should fail if `file_url` is not unique', () => {
    return knex('media').insert(file_url_ununique)
      .catch((err) => {
        expect(err.errno).to.equal(1062);
        expect(err.code).to.equal('ER_DUP_ENTRY');
      });
  });
});
