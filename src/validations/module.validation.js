const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createModule = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    complex: Joi.string().custom(objectId),
    district: Joi.string(),
    serialNumber: Joi.string().required(),
    wifiMacAddress: Joi.string().required(),
    lanMacAddress: Joi.string().required(),
    owner: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getModules = {
  query: Joi.object().keys({
    code: Joi.string(),
    complex: Joi.string().custom(objectId),
    owner: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    moduleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      code: Joi.string(),
      complex: Joi.string().custom(objectId),
      district: Joi.string(),
      floorNames: Joi.array().items(Joi.string()),
      serialNumber: Joi.string(),
      wifiMacAddress: Joi.string(),
      lanMacAddress: Joi.string(),
      owner: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
};
