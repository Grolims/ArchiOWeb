const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authenticate = function authenticate(req, res, next) {
  // Ensure the header is present.
  const authorization = req.get('Authorization');
  if (!authorization) {
    return res.status(401).send('Authorization header is missing');
  }
  // Check that the header has the correct format.
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).send('Authorization header is not a bearer token');
  }
  // Extract and verify the JWT.
  const token = match[1];
  jwt.verify(token, config.secretKey, function(err, payload) {
    if (err) {
      return res.status(401).send('Your token is invalid or has expired');
    } else {
      req.currentUserId = payload.sub;

      const scope = payload.scope;
      req.currentUserPermissions = scope;
      next(); // Pass the ID of the authenticated user to the next middleware.
    }
  });
}

exports.authorize = function authorize (requiredPermission) {
  return function authorizationMiddleware(req, res, next){
    if (!req.currentUserPermissions) {
      return res.sendStatus(403);
    }

    const authorized = req.currentUserPermissions.includes(requiredPermission);
    if (!authorized) {
      return res.sendStatus(403);
    }

    next();
  };
}