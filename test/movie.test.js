const request = require('supertest');
const _ = require('lodash');
const { expect } = require('chai');

const dbHandler = require('./dbHandler');

const errors = require('../src/utilities/errors.json');

const app = require('../src/app');

beforeEach(async () => await dbHandler.dbInit());

const defaultMovie = {
  title: 'New Movie',
  year: '2020',
  runtime: '92',
  genres: ['Comedy', 'Fantasy'],
  director: 'Tim Burton',
  actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
  plot:
    'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
  posterUrl:
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg'
};

describe('GET /movie/', () => {
  it('should return all movies', (done) => {
    request(app)
      .get('/movie')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        expect(_.some(res.body.data, { title: 'Beetlejuice' })).to.be.true;
        done();
      });
  });

  it('should return all movies with genre Adventure', (done) => {
    request(app)
      .get('/movie?arrayOfGenrs=Adventure')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        expect(_.some(res.body.data, { genres: ['Adventure'] })).to.be.true;
        done();
      });
  });

  it('should return all movies with genre Adventure, Comedy', (done) => {
    request(app)
      .get('/movie?arrayOfGenrs=Adventure,Comedy')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        expect(
          _.some(
            res.body.data,
            { genres: ['Adventure'] },
            { genres: ['Comedy'] }
          )
        ).to.be.true;
        done();
      });
  });

  it('should return all movies with duration <=102 && >=82', (done) => {
    request(app)
      .get('/movie/?duration=92')
      .end(async (err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        const length = res.body.data.length;
        const correctLength = await dbHandler.getWithFilter(92);
        expect(length === correctLength).to.be.true;
        done();
      });
  });

  it('should return all movies with duration <=116 && >=96', (done) => {
    request(app)
      .get('/movie/?duration=106')
      .end(async (err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        const length = res.body.data.length;
        const correctLength = await dbHandler.getWithFilter(106);
        expect(length === correctLength).to.be.true;
        done();
      });
  });

  it('should return all movies with genres Comedy or Adventure and duration <=116 && >=96', (done) => {
    request(app)
      .get('/movie/?duration=106&arrayOfGenrs=Adventure,Comedy')
      .end(async (err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        const length = res.body.data.length;
        const correctLength = await dbHandler.getWithFilter(
          106,
          'Adventure,Comedy'
        );
        expect(length === correctLength).to.be.true;
        expect(
          _.some(
            res.body.data,
            { genres: ['Adventure'] },
            { genres: ['Comedy'] }
          )
        ).to.be.true;
        done();
      });
  });

  it('should return all movies with genres Comedy or Fantasy and duration <=102 && >=82', (done) => {
    request(app)
      .get('/movie/?duration=92&arrayOfGenrs=Fantasy,Comedy')
      .end(async (err, res) => {
        expect(res.body.success).to.be.true;
        expect(Array.isArray(res.body.data)).to.be.true;
        const length = res.body.data.length;
        const correctLength = await dbHandler.getWithFilter(
          92,
          'Fantasy,Comedy'
        );
        expect(length === correctLength).to.be.true;
        expect(
          _.some(res.body.data, { genres: ['Fantasy'] }, { genres: ['Comedy'] })
        ).to.be.true;
        done();
      });
  });
});

describe('GET /movie/random', () => {
  it('should return random movie', (done) => {
    request(app)
      .get('/movie/random')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        done();
      });
  });

  it('should return random movie with duration <= 102 && >=82', (done) => {
    request(app)
      .get('/movie/random?duration=92')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        expect(res.body.data.runtime >= 82).to.be.true;
        expect(res.body.data.runtime <= 102).to.be.true;
        done();
      });
  });

  it('should return random movie with duration <= 116 && >=96', (done) => {
    request(app)
      .get('/movie/random?duration=106')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        expect(res.body.data.runtime >= 96).to.be.true;
        expect(res.body.data.runtime <= 116).to.be.true;
        done();
      });
  });

  it('should return random movie with genres Comedy or Fantasy', (done) => {
    request(app)
      .get('/movie/random?arrayOfGenrs=Comedy,Fantasy')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        expect(
          res.body.data.genres.includes('Comedy') ||
            res.body.data.genres.includes('Fantasy')
        ).to.be.true;
        done();
      });
  });

  it('should return random movie with genre Adventure', (done) => {
    request(app)
      .get('/movie/random?arrayOfGenrs=Adventure')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        expect(res.body.data.genres.includes('Adventure')).to.be.true;
        done();
      });
  });

  it('should return random movie with genres Comedy or Fantasy and duration <= 116 && >=96', (done) => {
    request(app)
      .get('/movie/random?arrayOfGenrs=Comedy,Fantasy&duration=106')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        expect(res.body.data.runtime >= 96).to.be.true;
        expect(res.body.data.runtime <= 116).to.be.true;
        expect(
          res.body.data.genres.includes('Comedy') ||
            res.body.data.genres.includes('Fantasy')
        ).to.be.true;
        done();
      });
  });

  it('should return random movie with genre Adventure and duration <= 102 && >=82', (done) => {
    request(app)
      .get('/movie/random?arrayOfGenrs=Adventure&duration=92')
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title');
        expect(res.body.data.runtime >= 82).to.be.true;
        expect(res.body.data.runtime <= 102).to.be.true;
        expect(res.body.data.genres.includes('Adventure')).to.be.true;
        done();
      });
  });
});

describe('POST /movie/', () => {
  it('should create movie', (done) => {
    request(app)
      .post('/movie')
      .send(defaultMovie)
      .then(() => {
        request(app)
          .get('/movie')
          .end((err, res) => {
            expect(res.body.success).to.be.true;
            expect(Array.isArray(res.body.data)).to.be.true;
            expect(_.some(res.body.data, { title: 'New Movie' })).to.be.true;
            done();
          });
      });
  });

  it('should return error (without title)', (done) => {
    const { title, ...movie } = defaultMovie;
    request(app)
      .post('/movie')
      .send(movie)
      .end((err, res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.error.type === 'VALIDATION').to.be.true;
        expect(Array.isArray(res.body.error.errors)).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'title',
            msg: errors.NOT_EXISTS
          })
        ).to.be.true;
        done();
      });
  });

  it('should return error (title too long)', (done) => {
    request(app)
      .post('/movie')
      .send({ ...defaultMovie, title: new Array(260).join('x') })
      .end((err, res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.error.type === 'VALIDATION').to.be.true;
        expect(Array.isArray(res.body.error.errors)).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'title',
            msg: errors.TOO_LONG
          })
        ).to.be.true;
        done();
      });
  });

  it('should return error (year and runtime are string)', (done) => {
    request(app)
      .post('/movie')
      .send({ ...defaultMovie, year: 'String Year', runtime: 'String Runtime' })
      .end((err, res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.error.type === 'VALIDATION').to.be.true;
        expect(Array.isArray(res.body.error.errors)).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'year',
            msg: errors.NOT_NUMERIC
          })
        ).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'runtime',
            msg: errors.NOT_NUMERIC
          })
        ).to.be.true;
        done();
      });
  });

  it('should return error (genres not predefined)', (done) => {
    request(app)
      .post('/movie')
      .send({ ...defaultMovie, genres: ['FakeGenre'] })
      .end((err, res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.error.type === 'VALIDATION').to.be.true;
        expect(Array.isArray(res.body.error.errors)).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'genres',
            msg: errors.NOT_PREDEFINED
          })
        ).to.be.true;
        done();
      });
  });

  it('should return error (actors is number)', (done) => {
    request(app)
      .post('/movie')
      .send({ ...defaultMovie, actors: 10 })
      .end((err, res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.error.type === 'VALIDATION').to.be.true;
        expect(Array.isArray(res.body.error.errors)).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'actors',
            msg: errors.NOT_STRING
          })
        ).to.be.true;
        done();
      });
  });

  it('should return error (actors is number / title not exists / genres not predefined / year is string / director is number)', (done) => {
    const { title, ...movie } = defaultMovie;
    request(app)
      .post('/movie')
      .send({
        ...movie,
        actors: 10,
        year: 'String year',
        genres: ['Fake'],
        director: 12
      })
      .end((err, res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.error.type === 'VALIDATION').to.be.true;
        expect(Array.isArray(res.body.error.errors)).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'actors',
            msg: errors.NOT_STRING
          })
        ).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'title',
            msg: errors.NOT_EXISTS
          })
        ).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'year',
            msg: errors.NOT_NUMERIC
          })
        ).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'genres',
            msg: errors.NOT_PREDEFINED
          })
        ).to.be.true;
        expect(
          _.some(res.body.error.errors, {
            param: 'director',
            msg: errors.NOT_STRING
          })
        ).to.be.true;
        done();
      });
  });
});
