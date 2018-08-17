const express = require("express");
const router = express.Router();
const isEmpty = require("../../validations/is-empty");

// Load KeyValueStore model
const KeyValueStore = require("../../models/KeyValue");

// @route   GET api/object
// @desc    Get value from provided key
// @access  Public
router.post("/", (req, res) => {
  // Perform basic validation
  if (isEmpty(req.body.key)) {
    return res.status(400).json("Key is required");
  }

  KeyValueStore.findOne({ key: req.body.key }).then(key => {
    if (key) {
      return res
        .status(400)
        .json({ key: `Key ${req.body.key} already exists` });
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
  });
});

module.exports = router;
