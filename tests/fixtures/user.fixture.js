const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/services/user.service');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  username: faker.name.findName(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: '099191919',
  password,
  role: 'user',
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  username: faker.name.findName(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: '099191919',
  password,
  role: 'user',
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  username: faker.internet.userName(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: '099191919',
  password,
  role: 'admin',
};

const insertUsers = async users => {
  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    // eslint-disable-next-line no-await-in-loop
    await User.createUser(user);
  }
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
