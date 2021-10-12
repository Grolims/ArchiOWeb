var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const User = require('../models/user');
const secretKey = process.env.SECRET_KEY || 'changeme';
//const {authenticate} = require('./auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* POST new user */
router.post('/', function(req, res, next) {

  const plainPassword = req.body.password;
  const costFactor = 10;

  bcrypt.hash(plainPassword, costFactor, function(err, hashedPassword) {
    if (err) {
      return next(err);
    }
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  newUser.password = hashedPassword;
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedUser);
  });
  });
});

//login
router.post('/login', function(req, res, next) {
  User.findOne({ name: req.body.name }).exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.sendStatus(401);
    }
    bcrypt.compare(req.body.password, user.password, function(err, valid) {
      if (err) {
        return next(err);
      } else if (!valid) {
        return res.sendStatus(401);
      }
      // generate JWT 7 days
      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
      const payload = { sub: user._id.toString(), exp: exp };
      jwt.sign(payload, secretKey, function(err, token) {
        if (err) { return next(err); }
        res.send({ token: token }); // Send the token to the client.
      });
      // Login is valid...
      res.send(`Welcome ${user.name}!`);
    });
  })
});

module.exports = router;
