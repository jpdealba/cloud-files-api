let database;
let bucket;

function db(_db) {
  if (_db) {
    database = _db;
  }

  return database;
}

function bk(_bk) {
  if (_bk) {
    bucket = _bk;
  }

  return bucket;
}

module.exports = { db, bk };
