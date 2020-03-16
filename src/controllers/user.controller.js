const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user.transform());
});

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers(req.query);
  const response = users.map(user => user.transform());
  res.send(response);
});

const getUser = catchAsync(async (req, res) => {
  if (req.query.owner && req.query.owner !== req.params.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const user = await userService.getUserById(req.params.userId);
  res.send(user.transform());
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, req.body);
  res.send(user.transform());
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
