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

  KeyValueStore.findOne({ key: req.body.key })
    .then(key => {
      if (key) {
        return (
          res
            // WIP : Change to update instead of validating existing key
            .status(400)
            .json({ key: `Key ${req.body.key} already exists` })
        );
      } else {
        const newKey = new KeyValueStore({
          key: req.body.key,
          value: req.body.value
        });

        newKey
          .save()
          .then(newKey => res.json(newKey))
          .catch(err => console.log(err));
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/object/:key
// @desc    Get value by provided key
// @access  Public

router.get("/:key", (req, res) => {
  KeyValueStore.findOne({ key: req.params.key })
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
