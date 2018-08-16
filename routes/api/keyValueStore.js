const express = require("express");
const router = express.Router();

// @route   GET api/object
// @desc    Get value from provided key
// @access  Public
router.get("/", (req, res) => res.json({ msg: "Objects works" }));

module.exports = router;
