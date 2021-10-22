const jwt = require('jsonwebtoken');
const { addUser } = require('../models/Users');
const config = require('./auth.config');

ensureUserSignedIn = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    res.status(403).json({
      message: 'No token provided!'
    }).end();
    return
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized!'
      }).end();
      return
    }
    req.uid = decoded.id;
    next();
  });
};

findUser = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({
          message: 'Unauthorized!'
        }).end();
        return
      }
      req.uid = decoded.id;

    });
  } else {
    req.uid = null;
  }

  next();
};

ensureUserNotSignedIn = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (token) {
    res.status(400).json({
      message: "You are already signed in!"
    }).end();
    return
  }

  next();
};

const ensureValidUsernameInBody = function(req, res, next) {
  if (!req.body.username) {
      res.status(400).json({
          message: "The username field must not be empty."
      }).end();
      return;
  }
  next();
};

const ensureValidPasswordInBody = function(req, res, next) {
  if (!req.body.password) {
      res.status(400).json({
          message: "The password field must not be empty."
      }).end();
      return;
  }
  next();
}

module.exports = {
  ensureUserSignedIn,
  ensureValidUsernameInBody,
  ensureValidPasswordInBody,
  ensureUserNotSignedIn,
  findUser,
}