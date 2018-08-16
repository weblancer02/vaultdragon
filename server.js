const express = require("express");
const mongoose = require("mongoose");

// Define Object route
const keyValueStore = require("./routes/api/keyValueStore");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to Mongodb
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send());

//Use Route
app.use("/api/object", keyValueStore);

app.listen(port, () => console.log(`Server running on port ${port}`));