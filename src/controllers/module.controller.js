const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { moduleService } = require('../services');

const createModule = catchAsync(async (req, res) => {
  const module = await moduleService.createModule(req.body);
  res.status(httpStatus.CREATED).send(module);
});

const getModules = catchAsync(async (req, res) => {
  const modules = await moduleService.getModules(req.query);
  res.send(modules);
});

const getModule = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  if (req.query.owner && req.query.owner.toString() !== module.owner.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(module);
});

const updateModule = catchAsync(async (req, res) => {
  const module = await moduleService.updateModule(req.params.moduleId, req.body);
  res.send(module);
});

const deleteModule = catchAsync(async (req, res) => {
  await moduleService.deleteModule(req.params.moduleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
};
