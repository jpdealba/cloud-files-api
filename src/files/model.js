const processFile = require("../../middleware/upload");
const { format } = require("util");
const { db, bk } = require("../database/database");
class File {
  async findAll(user_id) {
    const database = db();
    const filesDb = database.collection("files");
    const snapshot = await filesDb
      .where("users", "array-contains", user_id)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => doc.data());
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

  async createOne(file, data) {
    const bucket = bk();
    try {
      if (!file) {
        return { message: "Please upload a file!" };
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
            users: `${[data.users]}`,
          },
        },
      });

      blobStream.on("error", (err) => {
        console.log(err);
        return false;
      });

      blobStream.on("finish", async (test) => {
        blob.setMetadata({
          test: "test",
        });
        const database = db();
        const filesDb = database.collection("files");
        const name = "files%2F" + data.creator_id + "%2F" + file.originalname;
        filesDb.add({
          creator_id: data.creator_id,
          date: new Date().toISOString(),
          users: data.users,
          file_name: file.originalname,
          creator_username: data.username,
          file: format(
            `https://firebasestorage.googleapis.com/v0/b/cloudfiles-7a01e.appspot.com/o/${name}?alt=media`
          ),
          preview_url: format(
            `https://firebasestorage.googleapis.com/v0/b/cloudfiles-7a01e.appspot.com/o/${name}?alt=media`
          ),
          is_public: data.is_public,
        });
        // return true;
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
