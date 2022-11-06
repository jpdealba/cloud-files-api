const processFile = require("../../middleware/upload");
const { format } = require("util");
var _ = require("lodash");
const { db, bk } = require("../database/database");
class File {
  async findAll(user_id) {
    const database = db();
    const filesDb = database.collection("files");
    const isInvited = await filesDb
      .where("users", "array-contains", user_id)
      .get();
    const isPublic = await filesDb.where("is_public", "==", "true").get();

    const [invitedSnapshot, publicSnapshot] = await Promise.all([
      isInvited,
      isPublic,
    ]);

    const invitedArray = invitedSnapshot.docs;
    const publicArray = publicSnapshot.docs;
    const array = _.concat(invitedArray, publicArray);

    const unique = _.uniqWith(array, _.isEqual);
    return unique.map((doc) => doc.data());
  }
  async findOne(file_id) {
    const database = db();
    const filesDb = database.collection("files");
    const doc = await filesDb.doc(file_id).get();
    if (!doc.exists) {
      return [];
    }
    return doc.data();
  }

  async findAllCreated(user_id) {
    const database = db();
    const filesDb = database.collection("files");
    const snapshot = await filesDb.where("creator_id", "==", user_id).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => doc.data());
  }

  async createOne(file, data, res) {
    const bucket = bk();
    try {
      if (!file) {
        return res.send({ message: "Please upload a file!" }).code(401);
      }
      const blob = bucket.file(
        "files/" + data.creator_id + "/" + file.originalname
      );

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.type,
          metadata: {
            creator: `${data.creator_id}`,
            users: `${data.users}`,
            is_public: `${data.is_public}`,
          },
        },
      });

      blobStream.on("error", (err) => {
        console.log(err);
        return res.send(false).error(500);
      });

      blobStream.on("finish", async (test) => {
        const database = db();
        const filesDb = database.collection("files");
        const name = "files%2F" + data.creator_id + "%2F" + file.originalname;
        const resp = await filesDb.add({
          creator_id: data.creator_id,
          date: new Date().toISOString(),
          users: data.users,
          file_name: file.originalname,
          creator_username: data.creator_username,
          file: format(
            `https://firebasestorage.googleapis.com/v0/b/cloudfiles-7a01e.appspot.com/o/${name}?alt=media`
          ),
          preview_url: format(
            `https://firebasestorage.googleapis.com/v0/b/cloudfiles-7a01e.appspot.com/o/${name}?alt=media`
          ),
          is_public: data.is_public,
        });
        const newDoc = await this.findOne(resp.id);
        res.send(newDoc);
      });
      blobStream.end(file.buffer);
    } catch (err) {
      return {
        message: `Could not upload the file: ${file.originalname}. ${err}`,
      };
    }
  }
}

module.exports = File;
