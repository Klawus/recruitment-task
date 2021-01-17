const { check } = require('express-validator');
const { validateBody } = require('../../../utilities');
const loadDb = require('../../../utilities/db/loadDb');

const errors = require('../../../utilities/errors.json');

class ValidateCreateMovie {
  constructor(body) {
    this.title = body.title || '';
    this.year = `${body.year}` || '';
    this.runtime = `${body.runtime}` || '';
    this.genres = body.genres || '';
    this.director = body.director || '';
    this.actors = body.actors || '';
    this.plot = body.plot || '';
    this.posterUrl = body.posterUrl || '';
  }
}

const validateCreateMovie = [
  check(['title', 'director', 'year', 'runtime', 'genres'])
    .exists()
    .withMessage(errors.NOT_EXISTS)
    .notEmpty()
    .withMessage(errors.EMPTY),
  check(['year', 'runtime']).isNumeric().withMessage(errors.NOT_NUMERIC),
  check(['title', 'director']).isString().withMessage(errors.NOT_STRING),
  check(['actors', 'plot', 'posterUrl'])
    .optional()
    .isString()
    .withMessage(errors.NOT_STRING),
  check(['title', 'director'])
    .isLength({
      max: 255
    })
    .withMessage(errors.TOO_LONG),
  check('genres')
    .isArray()
    .withMessage(errors.NOT_ARRAY)
    .custom(async (value) => {
      const { genres } = await loadDb();
      if (value) {
        value.forEach((item) => {
          if (!genres.includes(item)) throw new Error(errors.NOT_PREDEFINED);
        });
        return;
      }
      return;
    }),
  (req, res, next) => {
    // Getting only needed property
    req.body = new ValidateCreateMovie(req.body);
    validateBody(req, res, next);
  }
];

module.exports = validateCreateMovie;
