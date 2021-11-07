var express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Item = require('../models/item');
const ObjectId = mongoose.Types.ObjectId;
const secretKey = process.env.SECRET_KEY || 'MikkelBoss';
const jwt = require('jsonwebtoken');
const { authenticate } = require('./auth');

/* POST new user */
router.post('/', asyncHandler(async (req, res, next) => {

  const plainPassword = req.body.password;
  const costFactor = 10;

  const hashedPassword = await bcrypt.hash(plainPassword, costFactor)
  const newUser = new User(req.body);
  newUser.password = hashedPassword;
  // Save that document
  await newUser.save();
  res.status(201).send(newUser);

}));


/* GET paginated users listing */
router.get('/', asyncHandler(async (req, res, next) => {
  const total = await User.count();

  let query = User.find();

  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  // Parse the "pageSize" param (default to 100 if invalid)
  let pageSize = parseInt(req.query.pageSize, 10);
  if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
    pageSize = 100;
  }
  // Apply skip and limit to select the correct page of elements
  query = query.skip((page - 1) * pageSize).limit(pageSize);

  query = await query.exec();

  res.send({
    page: page,
    pageSize: pageSize,
    total: total,
    data: query
  });

})
);

/* GET user by id and associated items & salepoints */
router.get('/:id', loadUserFromParamsMiddleware, asyncHandler(async (req, res, next) => {

  countItemsByUser(req.user, function (itemsCreate) {

    res.send({
      ...req.user.toJSON(),
      itemsCreate
    });
  });

}));


/**
 * Update a specific user
 */
router.patch('/:id', authenticate, loadUserFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler(async (req, res, next) => {

  if (req.body.username !== undefined) {
    req.user.username = req.body.username;
  }

  if (req.body.admin !== undefined) {
    req.user.admin = req.body.admin;
  }

  if (req.body.password !== undefined) {
    const plainPassword = req.body.password;
    const costFactor = 10;

    const hashedPassword = await bcrypt.hash(plainPassword, costFactor)
    req.user.password = hashedPassword;
  }

  await req.user.save();
  res.status(200).send(`User ${req.user.username} has been successfully updated!`)

})
);


/**
 * @api {delete} /api/movies/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Permanently deletes a user
 */
router.delete('/:id', authenticate, loadUserFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler(async (req, res, next) => {
  
  await User.deleteOne({
    _id: req.params.id
  });

  res.status(200).send(`Ressource : ${req.user.username} deleted`)


}));


/**
 * Login route
 */
router.post('/login', asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ username: req.body.username });
  if (!user) { return userNotFound(res, req.body.username) }

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) { return res.status(401).send("Wrong password") }

  // Generate a valid JWT which expires in 7 days.
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  const permission = user.admin ? 'admin' : 'user';
  const payload = {
    sub: user._id.toString(),
    exp: exp,
    scope: permission
  };

  const token = jwt.sign(payload, secretKey);
  res.send({ token: token });
})
);


function loadUserFromParamsMiddleware(req, res, next) {

  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return userNotFound(res, userId);
  }

  User.findById(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return userNotFound(res, userId);
    }

    req.user = user;
    next();
  });
}

function userNotFound(res, userId) {
  return res.status(404).type('text').send(`No user found with ID ${userId}`);
}

/**
 * Count the number of items related to a user
 */
function countItemsByUser(user, callback) {
  Item.countDocuments().where('userId', user._id).exec(callback);
}

/**
 * Checks if requesting user is either an Admin or owner of the ressource
 */
function checkOwnerOrAdmin(req, res, next) {
  const autho = req.currentUserPermissions === 'admin' || req.user.id === req.currentUserId;
  if (!autho) {
    return res.status(403).send('Insufficient permissions')
  }

  next();
}

module.exports = router;