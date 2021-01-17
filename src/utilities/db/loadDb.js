const fs = require('fs/promises');
const errors = require('../errors.json');

const loadDb = async () => {
  try {
    const data = await fs.readFile(
      process.env.NODE_ENV !== 'TEST'
        ? './data/db.json'
        : './data/testsDB.json',
      'utf8'
    );
    return JSON.parse(data);
  } catch (err) {
    throw new Error(errors.NO_DB);
  }
};

module.exports = loadDb;
