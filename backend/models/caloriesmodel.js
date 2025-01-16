const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const caloriesSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, 
    },
    fitness: {
      type: Number,
      required: true,
      default: 0, 
    },
    nutrition: {
      type: Number,
      required: true,
      default: 0, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Calories', caloriesSchema);
