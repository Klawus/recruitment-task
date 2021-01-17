const loadDb = require('./loadDb');
const find = require('./find');
const findRandom = require('./findRandom');
const create = require('./create');
const saveToDb = require('./saveToDb');
const lastId = require('./lastId');

module.exports = {
  saveToDb,
  loadDb,
  find,
  findRandom,
  create,
  lastId
};
