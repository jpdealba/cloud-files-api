const express = require("express");
require("dotenv").config();

const apiRoutes = require("./src/api");

const app = express();

const port = process.env.PORT || 4000;

app.use("/api", apiRoutes);

app.get("", (req, res) => {
  res.send("api works!");
});

app.listen(port, () => {
  console.log("app is running in port " + port);
});

// database.connect().then(client => {

//   const db = client.db('memegenerator');
//   database.db(db);

//   app.listen(port, () => {
//     console.log('app is running in port ' + port);
//   });
// }).catch(err => {
//   console.log('Failed to connect to database');
// });
