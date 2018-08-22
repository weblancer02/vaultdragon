const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongodb = require("mongodb").MongoClient;

mongoose.Promise = global.Promise;

// Define Object route
const keyValueStore = require("./routes/api/keyValueStore");

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(error, req, res, next) {
  // We need to handle errors in app level for SyntaxError in JSON Object
  if (error instanceof SyntaxError) {
    res.status(400).json({
      key:
        "Invalid JSON Object format. Request should have { Key : Value } pair"
    });
  } else {
    next();
  }
});

// DB Config
const db =
  process.env.MONGODB_URI !== undefined
    ? process.env.MONGODB_URI
    : require("./config/keys").MONGODB_URI["development"];

// Connect to Mongodb
mongoose
  .connect(
    db,
    {
      auth: {
        user: "dragontest",
        password: "dragon1"
      }
    },
    { useNewUrlParser: true }
  )
  .then()
  .catch(err => console.log("ERROR:" + err));

const port = process.env.PORT || 5000;

app.set("port", port);
app.get("/", (req, res) => res.send("Vault Dragon Coding Test"));

//Use Route
const server = app.listen(port);
console.log("##################################");
console.log(`# Environment : ${app.settings.env}`);
console.log(`# Server running on port ${port}`);
console.log(`# Mongodb URI : ${process.env.MONGODB_URI}`);
console.log(`# Database : ${db}`);

app.use("/object", keyValueStore);

module.exports = server;
