const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string()
      .required()
      .custom(password),
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    phoneNumber: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      password: Joi.string().custom(password),
      name: Joi.string(),
      email: Joi.string().email(),
      phoneNumber: Joi.string(),
      role: Joi.string().valid('user', 'admin'),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
