const mongoose = require('mongoose');

const elevatorSchema = mongoose.Schema(
  {
    systemType: {
      type: Number,
      default: 0,
    },
    floorNumber: {
      type: Number,
      default: 0,
    },
    bottomFloor: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

const Elevator = mongoose.model('Elevator', elevatorSchema);

module.exports = Elevator;
