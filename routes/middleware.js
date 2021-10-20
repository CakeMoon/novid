const jwt = require('jsonwebtoken');
const config = require('./auth.config');

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    res.status(403).json({
      error: 'No token provided!'
    }).end();
    return
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).json({
        error: 'Unauthorized!'
      }).end();
      return
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken,
}