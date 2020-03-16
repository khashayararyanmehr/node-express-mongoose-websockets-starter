const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { pick } = require('lodash');
const AppError = require('../utils/AppError');
const { User } = require('../models');
const { getQueryOptions } = require('../utils/service.util');

const checkDuplicateEmail = async (email, excludeUserId) => {
  const user = await User.findOne({ email, _id: { $ne: excludeUserId } });
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
};

const checkDuplicateUsername = async (username, excludeUserId) => {
  const user = await User.findOne({ username, _id: { $ne: excludeUserId } });
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
};

const createUser = async userBody => {
  await checkDuplicateEmail(userBody.email);
  await checkDuplicateUsername(userBody.username);
  const _userBody = {};
  Object.assign(_userBody, userBody);
  _userBody.adminAccessPassword = await bcrypt.hash(`admin${userBody.password}`, 8);
  _userBody.programAccessPassword = await bcrypt.hash(`program${userBody.password}`, 8);
  _userBody.allSettingsAccessPassword = await bcrypt.hash(`allsettings${userBody.password}`, 8);
  const user = await User.create(_userBody);
  return user;
};

const getUsers = async query => {
  const filter = pick(query, ['name', 'role']);
  if (query.owner) {
    filter.id = query.owner;
  }
  const options = getQueryOptions(query);
  const users = await User.find(filter, null, options);
  return users;
};

const getUserById = async userId => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const getUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email');
  }
  return user;
};

const getUserByUsername = async username => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this username');
  }
  return user;
};

const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (updateBody.email) {
    await checkDuplicateEmail(updateBody.email, userId);
    await checkDuplicateUsername(updateBody.username, userId);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUser = async userId => {
  const user = await getUserById(userId);
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
};
