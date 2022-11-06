const express = require("express");
require("dotenv").config();

const apiRoutes = require("./src/api");
const connect = require("./src/database/connect");
const { db, bk } = require("./src/database/database");
const app = express();
const bp = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 4000;
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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
