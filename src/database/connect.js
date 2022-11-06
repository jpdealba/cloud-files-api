const fs = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const serviceAccount = require("../../key.json");

function connect() {
  return new Promise((resolve, reject) => {
    try {
      fs.initializeApp({
        credential: fs.credential.cert(serviceAccount),
        databaseURL: "https://cloudfiles-7a01e.firebaseio.com",
      });
      const storage = new Storage({ keyFilename: "key.json" });
      // var fil = storage.bucket()
      resolve([fs.firestore(), storage.bucket("cloudfiles-7a01e.appspot.com")]);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

module.exports = connect;
