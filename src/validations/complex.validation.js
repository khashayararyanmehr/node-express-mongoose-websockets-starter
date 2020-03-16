const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createComplex = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    owner: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getComplexes = {
  query: Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getComplex = {
  params: Joi.object().keys({
    complexId: Joi.string().custom(objectId),
  }),
};

const updateComplex = {
  params: Joi.object().keys({
    complexId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      address: Joi.string(),
      owner: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteComplex = {
  params: Joi.object().keys({
    complexId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createComplex,
  getComplexes,
  getComplex,
  updateComplex,
  deleteComplex,
};
