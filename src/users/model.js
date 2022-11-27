const { db, bk } = require("../database/database");
const Model = require("../database/model")

class User extends Model{
  constructor() {
    super("users")
  }

  async findByQuery(queryable) {
    const database = db()
      const params = {
        ...this.params,
        Key: {
          user_id: queryable
        }
      }
      console.debug(params);

    database.get(params, (err, data) => {
      if(err) return err;
      return data;
    });

//    const UserDB = database.collection("users");
//    const snapshot = await UserDB.where("displayName", ">=", queryable)
//      .where("displayName", "<=", queryable + "\uF7FF")
//      .get();
//    if (snapshot.empty) {
//      return [];
//    }
//    return snapshot.docs.map((doc) => doc.data());
  }

  async createUser(data) {
    const database = db();
    const UserDB = database.collection("users");
    const resp = await UserDB.doc(data.uid).set(data);
    return resp;
  }

  async findFromList(data) {
    const database = db();
    const UserDB = database.collection("users");
    const snapshot = await UserDB.where("uid", "in", data.users).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => doc.data());
  }
}

module.exports = User;
