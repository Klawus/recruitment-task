const database = require('../../utilities/db');
const successResponse = require('../../responses/succcessResponse');

exports.getRandomMovie = async (req, res, next) => {
  try {
    const { duration, arrayOfGenrs } = req.query;
    const data = await database.findRandom(+duration, arrayOfGenrs);
    return successResponse(res, 200, data);
  } catch (err) {
    return next(err);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const { duration, arrayOfGenrs } = req.query;
    const data = await database.find(+duration, arrayOfGenrs);
    return successResponse(res, 200, data);
  } catch (err) {
    return next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    await database.create(req.body);
    return successResponse(res, 201, {});
  } catch (err) {
    return next(err);
  }
};
