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
const {
  authenticate,
  authorize
} = require('./auth');

/* POST new user */
router.post('/', asyncHandler(async (req, res, next) => {

  const plainPassword = req.body.password;
  const costFactor = 10;

  const hashedPassword = await bcrypt.hash(plainPassword, costFactor)
  const newUser = new User(req.body);
  newUser.password = hashedPassword;
  // Save that document
  await newUser.save()
  res.status(201).send(newUser);

}));


/* GET users listing  paginated. */
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

    await query.exec(function (err, users) {
      if (err) {
        return next(err)
      }
      res.send({
        page: page,
        pageSize: pageSize,
        total: total,
        data: users
      });
    });

  })
);
 
  
  // User.find().sort('username').exec(function (total) {
  //   let query = User.find();

  //   let page = parseInt(req.query.page, 10);
  //   if (isNaN(page) || page < 1) {
  //     page = 1;
  //   }
  //   // Parse the "pageSize" param (default to 100 if invalid)
  //   let pageSize = parseInt(req.query.pageSize, 10);
  //   if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
  //     pageSize = 100;
  //   }
  //   // Apply skip and limit to select the correct page of elements
  //   query = query.skip((page - 1) * pageSize).limit(pageSize);

  //   query.exec(function (err, users) {
  //     if (err) {
  //       return next(err)
  //     }
  //     res.send({
  //       page: page,
  //       pageSize: pageSize,
  //       total: total,
  //       data: users
  //     });
  //   });
  // });



router.get('/:id', loadUserFromParamsMiddleware, asyncHandler(async (req, res, next) => {

  countItemsByUser(req.user, function (itemsCreate) {

    res.send({
      ...req.user.toJSON(),
      itemsCreate
    });
  });

}));


/**
 * update user username
 */
router.patch('/:id', authenticate, loadUserFromParamsMiddleware, function (req, res, next) {
  
  if (!(req.currentUserPermissions === 'admin' || req.user.id === req.currentUserId)) {
    console.log(req.currentUserPermissions);
    return res.status(403).send(`is admin === ${req.currentUserPermissions} -> ` + (req.currentUserPermissions == 'admin') )
  }

  res.send('Valid')

  //   //get the user for  check if admin
  //   User.findById(req.currentUserId).exec(function(err, admin) {
  //     if (err) {
  //       return next(err);
  //     }
  //      // The user is authorized to edit the thing only if he or she is
  // // the owner of the thing, or if he or she is an administrator.
  //   const autho =
  //   admin.admin === true ||
  //   admin.id === req.user.id;

  //   if (!autho) {
  //     return res.status(403).send('You cannot delete  the user if you are not the owner or admin')
  //   }
  //   // do if correct

  //   req.user.username = req.body.username;

  //   req.user.save(function (err, savedUser) {
  //     if (err) {
  //       return next(err);
  //     }

  //     res.send(savedUser)
  //   });
  // });

  // if (req.body.username !== undefined) {
  //   req.user.username = req.body.username;
  // }

  // if (req.body.admin !== undefined) {
  //   req.user.admin = req.body.admin;
  // }

  // req.user.save(function (err, savedUser) {
  //   if (err) {
  //     return next(err);
  //   }

  //   res.send(savedUser)
  // });

});

// Update password
router.patch('/password/:id', authenticate, loadUserFromParamsMiddleware, function (req, res, next) {


  // Get the user to check if admin
  User.findById(req.currentUserId).exec(function (err, admin) {
    if (err) {
      return next(err);
    }
    // The user is authorized to edit the thing only if he or she is
    // the owner of the thing, or if he or she is an administrator.
    const autho =
      admin.id === req.user.id;

    if (!autho) {
      return res.status(403).send('You cannot delete  the user if you are not the owner or admin')
    }
    // do if correct

    const plainPassword = req.body.password;
    const costFactor = 10;

    bcrypt.hash(plainPassword, costFactor, function (err, hashedPassword) {
      if (err) {
        return next(err);
      }

      req.user.password = hashedPassword;
      // Save that document
      req.user.save(function (err, savedUser) {
        if (err) {
          return next(err);
        }

        res.send(savedUser)
      });
    });

  });

});


/**
 * @api {delete} /api/movies/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Permanently deletes a user
 */
// router.delete('/:id', authenticate, loadUserFromParamsMiddleware, async function (req, res, next) {

//   async function deleteUser() {
//     //get the user for  check if admin
//     await User.findById(req.currentUserId).exec(function (err, admin) {
//       // The user is authorized to edit the thing only if he or she is
//       // the owner of the thing, or if he or she is an administrator.
//       const autho =
//         admin.admin === true ||
//         admin.id === req.user.id;

//       if (!autho) {
//         return res.status(403).send('You cannot delete  the user if you are not the owner or admin')
//       }
//       // do if correct
//       await Item.deleteOne({ userId: req.user._id }, function (err) {
//         req.user.remove(function (err) {
//           res.send(`Deleted user ${req.user.username}`)
//         });
//       });
//     });
//   }

//   deleteUser()
//     .catch(next);

// });

router.delete('/:id', authenticate, authorize('admin'), loadUserFromParamsMiddleware, asyncHandler(async (req, res, next) => {

  await User.deleteOne({
    _id: req.params.id
  });

  res.status(200).send(`Ressource : ${req.user.username} deleted`)


}));


/**
 * Login route
 */
router.post('/login', asyncHandler(async (req, res, next) => {

  await User.findOne({
    username: req.body.username
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return userNotFound(res, req.body.username);
    }
    // Validate the password.
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) {
        return next(err);
      } else if (!valid) {
        return res.status(401).send("Bad password");
      }
      // Generate a valid JWT which expires in 7 days.
      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
      const permission = user.admin ? 'admin' : 'user';
      const payload = {
        sub: user._id.toString(),
        exp: exp,
        scope: permission
      };


      jwt.sign(payload, secretKey, function (err, token) {
        if (err) {
          return next(err);
        }
        res.send({
          token: token
        }); // Send the token to the client.
      });
    });
  });

}));


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
 * numbre of item create by user
 */
function countItemsByUser(user, callback) {
  Item.countDocuments().where('userId', user._id).exec(callback);
}

function paginatedUsers() {
  return async (req, res, next) => {

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    const results = {};

    try {
      results.results = await User.find()
        .sort({
          _id: 1
        })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({
        message: "Error Occured"
      });
    }
  };
}

module.exports = router;