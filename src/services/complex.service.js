const httpStatus = require('http-status');
const { pick } = require('lodash');
const AppError = require('../utils/AppError');
const { Complex } = require('../models');
const { getQueryOptions } = require('../utils/service.util');

const createComplex = async complexBody => {
  const complex = await Complex.create(complexBody);
  return complex;
};

const getComplexes = async query => {
  const filter = pick(query, ['name', 'address']);
  const options = getQueryOptions(query);
  const complexes = await Complex.find(filter, null, options);
  return complexes;
};

const getComplexById = async complexId => {
  const complex = await Complex.findById(complexId);
  if (!complex) {
    throw new AppError(httpStatus.NOT_FOUND, 'Complex not found');
  }
  return complex;
};

const updateComplex = async (complexId, updateBody) => {
  const complex = await getComplexById(complexId);
  Object.assign(complex, updateBody);
  await complex.save();
  return complex;
};

const deleteComplex = async complexId => {
  const complex = await getComplexById(complexId);
  await complex.remove();
  return complex;
};

module.exports = {
  createComplex,
  getComplexes,
  getComplexById,
  updateComplex,
  deleteComplex,
};
