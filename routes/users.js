require('dotenv').config();
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const User = require('../models/User');

//@route get users
//@desc Register user
//@access public
router.post(
  '/',
  [check('username', 'username is requires').not().isEmpty()],
  [check('email', 'Please Enter a valid email').isEmail()],
  [
    check(
      'password',
      'Please enter the password with at least 6 characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ username });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exisits' }] });
      }

      //Get users gravatar
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        }),
        { forceHttps: true }
      );

      user = new User({
        username,
        email,
        password,
        avatar,
      });
      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      //Return jsonwebtoken(JWT)
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
