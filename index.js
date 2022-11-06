const express = require("express");
require("dotenv").config();

const apiRoutes = require("./src/api");
const connect = require("./src/database/connect");
const { db, bk } = require("./src/database/database");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(cors());

app.use("/api", apiRoutes);

app.get("", (req, res) => {
  res.send("api works!");
});

connect()
  .then((data) => {
    db(data[0]);
    bk(data[1]);
    app.listen(port, () => {
      console.log("app is running in port " + port);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database");
  });
