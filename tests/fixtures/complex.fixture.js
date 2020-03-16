const mongoose = require('mongoose');
const faker = require('faker');
const Complex = require('../../src/services/complex.service');
const { userOne, userTwo, insertUsers } = require('./user.fixture');

const complexOne = {
  _id: mongoose.Types.ObjectId(),
  name: `1${faker.name.findName()}`,
  address: faker.address.streetAddress(),
  owner: userOne._id,
};

const complexTwo = {
  _id: mongoose.Types.ObjectId(),
  name: `2${faker.name.findName()}`,
  address: faker.address.streetAddress(),
  owner: userTwo._id,
};

const insertComplexes = async complexes => {
  // eslint-disable-next-line no-restricted-syntax
  for (const complex of complexes) {
    // eslint-disable-next-line no-await-in-loop
    await Complex.createComplex(complex);
  }
};

module.exports = {
  complexOne,
  complexTwo,
  insertComplexes,
};
