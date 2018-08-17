const express = require("express");
const router = express.Router();
const isEmpty = require("../../validations/is-empty");

// Load KeyValueStore model
const KeyValueStore = require("../../models/KeyValue");

// @route   POST api/object
// @desc    POST Key, Value pair & Timestamp
// @access  Public
router.post("/", (req, res) => {
  // Perform basic validation
  if (isEmpty(req.body.key)) {
    return res.status(400).json("Key is required");
  }

  const newKey = new KeyValueStore({
    key: req.body.key,
    value: req.body.value,
    timestamp: Math.floor(Date.now() / 1000)
  });

  newKey
    .save()
    .then(newKey => res.json(newKey))
    .catch(err => console.log(err));
});

// @route   GET api/object/:key
// @desc    Get value by provided key
// @access  Public

router.get("/:key", (req, res) => {
  // If key and timestamp is provided
  // use find() whereas findOne for req without timestamp
  if (req.query.timestamp)
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
            key: `No matching key found for ${req.params.key} with ${
              req.query.timestamp
            } timestamp.`
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
