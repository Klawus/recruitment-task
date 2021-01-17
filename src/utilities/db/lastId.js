const lastId = (table) => Math.max(...table.map((item) => item.id));

module.exports = lastId;
