const fs = require('fs/promises');
const loadDb = require('./loadDb');

const saveToDb = async (movies = {}) => {
  const { genres } = await loadDb();
  await fs.writeFile(
    process.env.NODE_ENV !== 'TEST' ? './data/db.json' : './data/testsDB.json',
    JSON.stringify({ genres, movies }, null, 2),
    'utf8'
  );
};

module.exports = saveToDb;
