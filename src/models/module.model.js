const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    complex: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Complex',
    },
    district: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    wifiMacAddress: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    lanMacAddress: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    isSetup: {
      type: Boolean,
      default: false,
    },
    floorNames: [
      {
        type: String,
      },
    ],
    elevators: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Elevator',
      },
    ],
    lastSeenAt: {
      type: Date,
      default: null,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
