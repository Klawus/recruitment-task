const loadDb = require('./loadDb');

const find = async (duration = null, arrayOfGenrs = null) => {
  let { movies } = await loadDb();
  if (duration && typeof duration === 'number')
    movies = movies.filter(
      ({ runtime }) => +runtime <= duration + 10 && +runtime >= duration - 10
    );
  if (arrayOfGenrs && typeof arrayOfGenrs === 'string') {
    const genrsList = arrayOfGenrs.split(',').map((item) => item.toLowerCase());
    if (genrsList.length === 0) return movies;
    movies = movies
      .reduce((prev, curr) => {
        let searchIndex = 0;
        const tempGenres = curr.genres.map((item) => item.toLowerCase());
        genrsList.forEach((item) => {
          if (tempGenres.includes(item)) searchIndex++;
        });
        if (searchIndex)
          return [
            ...prev,
            {
              searchIndex,
              ...curr
            }
          ];
        return prev;
      }, [])
      .sort((a, b) => b.searchIndex - a.searchIndex)
      .map(({ searchIndex, ...item }) => item);
  }
  return movies;
};

module.exports = find;
