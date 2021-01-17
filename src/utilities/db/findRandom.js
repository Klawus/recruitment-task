const find = require('./find');

const findRandom = async (duration = null, arrayOfGenrs = null) => {
  const movies = await find(duration, arrayOfGenrs);
  return movies[Math.floor(Math.random() * movies.length)];
};

module.exports = findRandom;
