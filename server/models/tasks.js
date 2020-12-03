let mongoose = require("mongoose");

const collection = "kevinsDocument";

let Tasks = mongoose.model(
  collection,
  {
    taskName: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  collection
);

module.exports = {
  Tasks,
};
