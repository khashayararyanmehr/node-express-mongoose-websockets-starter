const httpStatus = require('http-status');
const { pick } = require('lodash');
const AppError = require('../utils/AppError');
const { Module } = require('../models');
const { getQueryOptions } = require('../utils/service.util');

const checkDuplicateCode = async (code, excludeModuleId) => {
  const user = await Module.findOne({ code, _id: { $ne: excludeModuleId } });
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Code already taken');
  }
};

const createModule = async moduleBody => {
  await checkDuplicateCode(moduleBody.code);
  const module = await Module.create(moduleBody);
  return module;
};

const getModules = async query => {
  const filter = pick(query, ['code', 'complex', 'owner']);
  const options = getQueryOptions(query);
  const modules = await Module.find(filter, null, options);
  return modules;
};

const getModuleById = async moduleId => {
  const module = await Module.findById(moduleId).populate('elevators');
  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }
  return module;
};

const updateModule = async (moduleId, updateBody) => {
  const module = await getModuleById(moduleId);
  if (updateBody.code) {
    await checkDuplicateCode(updateBody.code, moduleId);
  }
  Object.assign(module, updateBody);
  await module.save();
  return module;
};

const deleteModule = async moduleId => {
  const module = await getModuleById(moduleId);
  await module.remove();
  return module;
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
};
