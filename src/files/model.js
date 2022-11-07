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
    const array = invitedArray.concat(publicArray);

    const newArray = array.map((doc) => doc.data());
    const arrayUniqueByKey = [
      ...new Map(newArray.map((item) => [item["date"], item])).values(),
    ];
    return arrayUniqueByKey;
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

  async deleteOne(data) {
    const database = db();
    const filesDb = database.collection("files");
    const snapshot = await filesDb
      .where("creator_id", "==", data.creator_id)
      .where("date", "==", data.date)
      .where("file_name", "==", data.file_name)
      .where("preview_url", "==", data.preview_url)
      .get();

    if (snapshot.empty) {
      return [];
    }
    const id = snapshot.docs[0].id;
    const bucket = bk();
    await filesDb.doc(id).delete();
    const name = data.file.replaceAll("%2F", "/").split("/files/");
    const file_name = "files/" + name[1].split("?alt=")[0];
    const file = bucket.file(file_name);
    file.delete();
    return "Successfull";
  }

  async updateOne(data) {
    const bucket = bk();
    const file_name = data.file.replaceAll("%2F", "/").split("/files/");
    const file = bucket.file("files/" + file_name[1].split("?alt=")[0]);
    const toChange = {};
    if (data.users) {
      toChange.users = data.users;
    }
    const meta = await file.getMetadata();
    await file.setMetadata({
      metadata: {
        contentType: meta[0].contentType,
        creator: `${data.creator_id}`,
        users: `${data.users}`,
        is_public: `${data.is_public}`,
      },
    });
    const database = db();
    const filesDb = database.collection("files");
    const snapshot = await filesDb
      .where("file", "==", data.file)
      .where("creator_id", "==", data.creator_id)
      .get();
    if (snapshot.empty) {
      return [];
    }

    const id = snapshot.docs[0].id;
    return await filesDb.doc(id).update(data);
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
