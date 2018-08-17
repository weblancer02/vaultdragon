const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const KeyValueSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: {},
    default: ""
  },
  timestamp: {
    type: Number,
    default: Math.floor(Date.now() / 1000)
  }
});

module.exports = KeyValue = mongoose.model(
  "key_value_timestamp",
  KeyValueSchema
);
