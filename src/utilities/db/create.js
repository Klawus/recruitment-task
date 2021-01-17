const loadDb = require('./loadDb');
const lastId = require('./lastId');
const saveToDb = require('./saveToDb');

const create = async (obj = {}) => {
  const { movies } = await loadDb();
  const id = lastId(movies);
  const newObject = {
    id: id + 1,
    ...obj
  };
  await saveToDb([...movies, newObject]);
  return newObject;
};

module.exports = create;
