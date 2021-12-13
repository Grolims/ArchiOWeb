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
const { broadcastMessage } = require('../messaging');




/**
 * @api {post} /users Create a user
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Registers a new user.
 *
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiSuccess (Response body) {String} id A unique identifier for the user generated by the server
 *
 * @apiExample Example
 *     POST /users HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "username": "Kestar",
 *       "admin": true,
 *       "password": "1234test"
 *     }
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location: https://localsearch-ch.herokuapp.com/users/61912511d1f3e541d9a2177c
 *
 *     {
 *       "username": "Kestar",
 *       "admin": true,
 *       "_id": "61912511d1f3e541d9a2177c",
 *       "registrationdate": "2021-11-14T15:02:41.974Z",
 *       "__v": 0
 *     }
 */
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


/**
 * @api {get} /users List user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated list of user sorted by name (in alphabetical order).
 *
 * @apiUse UserInResponseBody
 *
 *
 * @apiExample Example
 *     GET /users?page=1&pageSize=100 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: https://localsearch-ch.herokuapp.com/users?page=1&pageSize=50
 *
 * {
 *  "page": 1,
 *  "pageSize": 100,
 *  "total": 2,
 *  "data": [
 *      {
 *          "_id": "61912511d1f3e541d9a2177c",
 *          "username": "Kestar",
 *          "admin": true,
 *          "registrationdate": "2021-11-14T15:02:41.974Z",
 *          "__v": 0
 *      },
 *      {
 *          "_id": "619126a15f69d38480a2a49f",
 *          "username": "Mikvester",
 *          "admin": false,
 *          "registrationdate": "2021-11-14T15:09:21.935Z",
 *          "__v": 0
 *      }
 *   ]
 * }
 */
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


/**
 * @api {get} /users/:id GET user by id
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves one user with item add.
 *
 * @apiUse UserIdInUrlPath
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 *
 * @apiExample Example
 *     GET /users/61912511d1f3e541d9a2177c HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "_id": "61912511d1f3e541d9a2177c",
 *       "username": "Kestar",
 *       "itemAdd": 1
 *     }
 */
router.get('/:id', loadUserFromParamsMiddleware, asyncHandler(async (req, res, next) => {
  User.aggregate([
    {
    $match:{
      _id: ObjectId(req.params.id)

    }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'userId',
        as: 'itemAdd'
      }
    },
    {
      $unwind: {
        path: '$itemAdd',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
       itemAdd: {
          $cond: {
            if: '$itemAdd',
            then: 1,
            else: 0
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        username: { $first: '$username' },
        itemAdd: { $sum: '$itemAdd'},
      }
    }
  ], (err, results) => {
    if (err) {
      return next(err);
    }
    
    res.send(results[0]);
  });

}));



/**
 * @api {patch} /users/:id Partially update a user
 * @apiName PartiallyUpdateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Partially updates a user's data (only the properties found in the request body will be updated).
 * All properties are optional.
 *
 * @apiUse UserIdInUrlPath
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 *
 * @apiExample Example
 *     PATCH /users/619126a15f69d38480a2a49f HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "username": "Mikvester22",
 *       "admin": true
 *     }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "_id": "619126a15f69d38480a2a49f",
 *       "username": "Mikvester22",
 *       "admin": true,
 *       "registrationdate": "2021-11-14T15:09:21.935Z",
 *       "__v": 0
 *     }
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
  res.status(200).send(req.user);

})
);


/**
 * @api {delete} /users/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Permanently deletes a user
 * 
 * @apiExample Example
 *     DELETE /users/619126a15f69d38480a2a49f HTTP/1.1
 * 
 * @apiSuccessExample 204 No Content
 *     HTTP/1.1 204 No Content
 */
router.delete('/:id', authenticate, loadUserFromParamsMiddleware, checkOwnerOrAdmin, asyncHandler(async (req, res, next) => {
  
  await User.deleteOne({
    _id: req.params.id
  });
  let username =  req.user.username;
  res.status(200).send({user: username , statut : 'deleted'})


}));


/**
 * Login route
 */
/**
 * @api {post} /login Login
 * @apiName Login
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Connect to an account
 *
 * @apiParam (Request body) {String{3..30}} username The username of the User (must be unique)
 * @apiParam (Request body) {String{min 8}} password Password of the account
 * 
 * @apiUse UserInResponseBody
 *
 * @apiExample Example
 *     POST /login HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "username": "Kestar",
 *       "password": "1234test"
 *     }
 *
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
  res.send({ token: token, user });
})
);


async function loadUserFromParamsMiddleware(req, res, next) {

  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return userNotFound(res, userId);
  }

  const user = await User.findById(req.params.id);
  if (!user) { return userNotFound(res, userId) }

  req.user = user;
  next()
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
  const autho = req.currentUserPermissions === 'admin' || req.user.id.toString() === req.currentUserId;
  if (!autho) {
    return res.status(403).send('Insufficient permissions')
  }

  next();
}


/**
 * @apiDefine UserIdInUrlPath
 * @apiParam (URL path parameters) {String} id The unique identifier of the User to retrieve
 */

/**
 * @apiDefine UserInRequestBody
 * @apiParam (Request body) {String{3..30}} username The username of the User (must be unique)
 * @apiParam (Request body) {Boolean} admin Is an admin account or not
 * @apiParam (Request body) {String{min 8}} password Password of the account
 */

/**
 * @apiDefine UserInResponseBody
 * @apiSuccess (Response body) {String} username The username of the User
 * @apiSuccess (Response body) {String} itemAdd The number of items add by the User
 * @apiSuccess (Response body) {Boolean} admin Is an admin account or not
 * @apiSuccess (Response body) {String} id The unique identifier of the User
 * @apiSuccess (Response body) {Date} registrationdate The registration date of the User
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError {Object} 404/NotFound No User was found corresponding to the ID in the URL path
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No User found with ID 58b2926f5e1def0123e97bc0
 */

module.exports = router;