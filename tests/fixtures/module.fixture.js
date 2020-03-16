const mongoose = require('mongoose');
const faker = require('faker');
const Module = require('../../src/services/module.service');
const { userOne, userTwo } = require('./user.fixture');
const { complexOne, complexTwo } = require('./complex.fixture');

const moduleOne = {
  _id: mongoose.Types.ObjectId(),
  code: '1',
  complex: complexOne._id,
  district: faker.commerce.department(),
  serialNumber: '123-33-123',
  wifiMacAddress: '123:22:222',
  lanMacAddress: '123:22:222',
  owner: userOne._id,
};
const moduleTwo = {
  _id: mongoose.Types.ObjectId(),
  code: '2',
  complex: complexTwo._id,
  district: faker.commerce.department(),
  serialNumber: '123-33-124',
  wifiMacAddress: '123:22:223',
  lanMacAddress: '123:22:223',
  owner: userTwo._id,
};

const insertModules = async modules => {
  // eslint-disable-next-line no-restricted-syntax
  for (const module of modules) {
    // eslint-disable-next-line no-await-in-loop
    await Module.createModule(module);
  }
};

module.exports = {
  moduleOne,
  moduleTwo,
  insertModules,
};
