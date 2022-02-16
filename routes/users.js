const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// @route POST api/users
// @desc Register a new user
// @access Public
router.post(
  "/",
  [
    check("name", "Please add a name").not().isEmpty(), //checking if there's a namee
    check("email", "Please include a valid email").isEmail(), //email
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }), // password of at least 6 characters
  ],
  (req, res) => {
    //if errors aren't empty return 400 with array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send("passed");
  }
);

module.exports = router;
