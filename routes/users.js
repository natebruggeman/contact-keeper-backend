const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { reset } = require("nodemon");

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
  async (req, res) => {
    //if errors aren't empty return 400 with array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email }); //finding if email exists in the db

      if (user) {
        return res.status(400).json({ msg: "This user already exists" });
      }
      //creating a new instance of a user
      user = new User({
        name,
        email,
        password,
      });

      //creating salt so we can hash the password
      const salt = await bcrypt.genSalt(10);

      //hashing the password
      user.password = await bcrypt.hash(password, salt);

      //saving the name, email, and hashed password to the db
      await user.save();

      // creating payload, all we need is id because we can get the rest of info with just id
      const payload = {
        user: {
          id: user.id,
        },
      };

      //
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
