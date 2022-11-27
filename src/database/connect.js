const AWSConfig = require("./aws.config.js")
const AWS = require("aws-sdk");

function connect() {
  AWS.config.update(AWSConfig);
  return new Promise((resolve, reject) => {
    try {
      const docClient = new AWS.DynamoDB.DocumentClient();
      resolve(docClient)
    } catch (err) {
      reject(err);
    }
  });
}


module.exports = connect;
