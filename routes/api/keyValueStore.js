const express = require("express");
const router = express.Router();
const isEmpty = require("../../validations/is-empty");

// Load KeyValueStore model
const KeyValueStore = require("../../models/KeyValue");

// @route   POST api/object
// @desc    POST Key, Value pair & Timestamp
// @access  Public
router.post("/", (req, res) => {
  // We register the keys for post request
  const objKey = Object.keys(req.body);

  // We limit 1 JSON key pair per post
  if (objKey.length > 1) {
    res
      .status(400)
      .json({ key: "You can only send one JSON Object per post." });
  }
  // Validate if JSON object is empty
  else if (isEmpty(req.body)) {
    res.status(400).json({
      key: "Empty JSON Object. Request should have { Key : Value } pair"
    });
  }
  // Store our key value pair to the database
  else {
    const newKey = new KeyValueStore({
      key: objKey,
      value: req.body[objKey],
      timestamp: Math.floor(Date.now() / 1000)
    });

    newKey
      .save()
      .then(newKey =>
        res.json({
          key: newKey.key,
          value: newKey.value,
          timestamp: newKey.timestamp
        })
      )
      .catch(err => console.log(err));
  }
});

// @route   GET api/object/:key
// @desc    Get value by provided key
// @access  Public

router.get("/:key", (req, res) => {
  // If key and timestamp is provided
  // use find() whereas findOne for req without timestamp
  if (Object.keys(req.query).length)
    if (Object.keys(req.query).indexOf("timestamp") === -1)
      // We used indexOf to search for "timestamp" query string
      // from the given request. This will ensure that as long as
      // "timestamp" is in the request, the function will work and extendable
      return res
        .status(400)
        .json({ timestamp: "'Timestamp' query not found." });
    else
      KeyValueStore.findOne({
        key: req.params.key,
        timestamp: {
          $lte: req.query.timestamp
        }
      })
        .sort({ timestamp: -1 })
        .then(key => {
          if (key) {
            res.json({ value: key.value });
          } else {
            return res.status(400).json({
              key: `No matching key found for ${req.params.key} with ${req.query
                .timestamp || 0} timestamp.`
            });
          }
        })
        .catch(err => res.status(404).json(err));
  else
    KeyValueStore.findOne({ key: req.params.key })
      .sort({ timestamp: -1 })
      .then(key => {
        if (key) {
          res.json({ value: key.value });
        } else {
          return res
            .status(400)
            .json({ key: `No matching key found for ${req.params.key}` });
        }
      })
      .catch(err => res.status(404).json(err));
});

module.exports = router;
