const { omit, pick } = require('lodash');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isNumeric(value)) {
          throw new Error('Invalid phoneNumber');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    adminAccessPassword: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    programAccessPassword: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    allSettingsAccessPassword: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

userSchema.methods.toJSON = function() {
  const user = this;
  return omit(user.toObject(), ['password']);
};

userSchema.methods.transform = function() {
  const user = this;
  return pick(user.toJSON(), ['id', 'username', 'email', 'name', 'phoneNumber', 'role']);
};

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.adminAccessPassword = await bcrypt.hash(`admin${user.password}`, 8);
    user.programAccessPassword = await bcrypt.hash(`program${user.password}`, 8);
    user.allSettingsAccessPassword = await bcrypt.hash(`allsettings${user.password}`, 8);
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
