const { db, bk } = require("../database/database");

class User {
  async findByQuery(queryable) {
    const database = db();
    const UserDB = database.collection("users");
    const snapshot = await UserDB.where("displayName", ">=", queryable)
      .where("displayName", "<=", queryable + "\uF7FF")
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => doc.data());
  }

  async createUser(data) {
    const database = db();
    const UserDB = database.collection("users");
    const resp = await UserDB.doc(data.uid).set(data);
    return resp;
  }
}

module.exports = User;
