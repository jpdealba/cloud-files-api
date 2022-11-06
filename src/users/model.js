const { db, bk } = require("../database/database");

class User {
  findByEmail(queryable) {}

  async createUser(data) {
    const database = db();
    const UserDB = database.collection("users");
    const resp = await UserDB.doc(data.uid).set(data);
    return resp;
  }
}

module.exports = User;
