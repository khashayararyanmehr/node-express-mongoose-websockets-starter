/* eslint-disable no-unreachable */

const httpStatus = require('http-status');
const AppError = require('./AppError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  // TODO: remove next line to activate authorization
  return resolve(); // temporarily
  // eslint-disable-next-line no-unreachable
  if (err || info || !user) {
    return reject(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  if (requiredRights.length) {
    // check for owner role [ should become middleware ]
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every(requiredRight => {
      return requiredRight.startsWith('$') || userRights.includes(requiredRight);
    });
    if (!hasRequiredRights) {
      if (requiredRights.indexOf('$owner') !== -1) {
        req.query.owner = user.id;
        return resolve();
      }
      return reject(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

module.exports = verifyCallback;
