const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

const db = require("./config/keys").mongoURI[app.settings.env];

// Connect to Mongodb
mongoose.connect(
  db,
  { useNewUrlParser: true }
);
// .then(() => console.log("# MongoDB connected successfully"))
// .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Vault Dragon Coding Test"));

//Use Route
const server = app.listen(port);
console.log("##################################");
console.log(`# Environment : ${app.settings.env}`);
console.log(`# Server running on port ${port}`);

app.use("/api/object", keyValueStore);

module.exports = server;
