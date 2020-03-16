const mongoose = require('mongoose');
const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { complexService } = require('../services');

const createComplex = catchAsync(async (req, res) => {
  const complex = await complexService.createComplex(req.body);
  res.status(httpStatus.CREATED).send(complex);
});

const getComplexes = catchAsync(async (req, res) => {
  const complexes = await complexService.getComplexes(req.query);
  res.send(complexes);
});

const getComplex = catchAsync(async (req, res) => {
  const complex = await complexService.getComplexById(req.params.complexId);
  if (req.query.owner && req.query.owner.toString() !== complex.owner.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(complex);
});

const updateComplex = catchAsync(async (req, res) => {
  const complex = await complexService.updateComplex(req.params.complexId, req.body);
  res.send(complex);
});

const deleteComplex = catchAsync(async (req, res) => {
  await complexService.deleteComplex(req.params.complexId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createComplex,
  getComplexes,
  getComplex,
  updateComplex,
  deleteComplex,
};
