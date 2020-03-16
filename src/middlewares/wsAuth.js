const passport = require('passport');
const verifyCallback = require('../utils/authVerifyCallback.util');

const wsAuth = (...requiredRights) => async (ws, req, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, null, next);
  })
    .then(() => next())
    .catch(err => {
      ws.send(err.toString());
      ws.close();
    });
};

module.exports = wsAuth;
